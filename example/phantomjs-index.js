var page = require('webpage').create(),
    system = require('system'),
    example = system.args[1];
    imagesDir = 'images/';
page.viewportSize = { width: 960, height: 540 };
page.open('http://localhost:8000/' + example + '/index.html', function (status) {
  setTimeout(function () {
    page.evaluate(function() {
      document.body.bgColor = 'white';
    });
    page.render(image(example));
    phantom.exit();
  }, 1000);
});
function image(example){
  return imagesDir + example.replace('/', '_') + '.png';
}
