// A Node.js script that transforms `raw.csv` into `../total_population.csv`
// Curran Kelleher 5/2/2014
var utils = require('../../../js/utils.js'),
    inFile = 'raw.csv',
    outFile = '../total_population.csv';

utils.input(inFile, function (data) {
  var rows = data.split('\r\n').slice(1),
      un_population = ['countryCode,year,population'];
  rows.splice(rows.length - 1, 1);
  rows.forEach(function (row) {
    var entries = utils.parse(row),
        yearEntries = entries.slice(5, 66),
        countryCode = entries[4];
    yearEntries.forEach(function (value, i) {
      var year = i + 1950,
          population = value.replace(/\s+/g, '');
      un_population.push([countryCode, year, population].join(','));
    });
  });
  utils.output(outFile, un_population.join('\n'));
});

