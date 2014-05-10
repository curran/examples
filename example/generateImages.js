// This script takes screenshots of examples using PhantomJS,
// then generates thumbnails using graphicsMagick.
// Curran Kelleher 5/10/2014
var path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    gm = require('gm'),
    binPath = phantomjs.path,
    imagesDir = __dirname + '/../images/';

function generateImages(example, callback){
  renderExample(example, function () {
    gm(image(example))
      //.resize(240, 135)
      .resize(320, 180)
      .write(thumb(example), function (err) {
        if (err) console.log(err);
        else callback();
      });
  });
}

function image(example){
  return imagesDir + example.replace('/', '_') + '.png';
}

function thumb(example){
  return imagesDir + example.replace('/', '_') + '_thumb.png';
}

function renderExample(example, callback){
  var childArgs = [
    path.join(__dirname, 'phantomjs-index.js'),
    example
  ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    console.log(stderr);
    callback();
  });
}

module.exports = generateImages;
