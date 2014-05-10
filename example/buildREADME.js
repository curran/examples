var Handlebars = require('handlebars'),
    examplesTemplate = Handlebars.compile(
      '<ul>{{#examples}}<li>{{name}}</li>{{/examples}}</ul>'
    );

module.exports = function (data) {
  console.log(examplesTemplate({ examples: data }));
};
