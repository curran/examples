var page = require('webpage').create(),
    system = require('system'),
    example = system.args[1];
page.viewportSize = { width: 960, height: 540 };
page.open('http://localhost:8000/' + example + '/index.html', function (status) {
  setTimeout(function () {
    page.evaluate(function() {
      document.body.bgColor = 'white';
    });
    page.render('images/' + example.replace('/', '_') + '.png');
    phantom.exit();
  }, 1000);
});
