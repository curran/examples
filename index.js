// This script takes screenshots of examples.
// Curran Kelleher 5/9/2014

var path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    gm = require('gm'),
    binPath = phantomjs.path,
    example = 'countriesScatter/v1',
    imagesDir = __dirname + '/images/';

console.log(imagesDir + example.replace('/', '_') + '.png');
 
renderExample(example, function () {
  console.log('done');
  gm(imagesDir + example.replace('/', '_') + '.png')
    .resize(240, 240)
    .write(imagesDir + example.replace('/', '_') + '_thumb.png', function (err) {
      if (err) console.log(err);
    });
});

function renderExample(example, callback){
  var childArgs = [
    path.join(__dirname, 'phantomjs-index.js'),
    example
  ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    callback();
  });
}

