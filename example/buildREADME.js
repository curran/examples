var fs = require('fs'),
    Handlebars = require('handlebars'),
    examplesTemplate = Handlebars.compile(
      '{{#entries}}<a href="http://curran.github.io/examples/{{name}}/{{latest}}"><img src="images/{{name}}_{{latest}}_thumb.png"></a>{{/entries}}'
    );

module.exports = function (entries) {
  fs.readFile('README_template.md', 'utf8', function (err, readmeTemplateText) {
    if(err) throw err;
    var readmeTemplate = Handlebars.compile(readmeTemplateText),
        readmeText = readmeTemplate({
          examples: examplesTemplate({ entries: entries })
        });
    fs.writeFile('README.md', readmeText, function(err) {
      console.log('Wrote README.md');
    }); 
  });
};
