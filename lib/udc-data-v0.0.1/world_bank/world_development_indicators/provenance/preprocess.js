// A Node.js script that transforms the raw data into a clean CSV file.
// Curran Kelleher 5/3/2014
var utils = require('../../../js/utils.js'),
    inFile = 'ny.gdp.mktp.cd_Indicator_en_csv_v2.csv',
    outFile = '../GDP_current_USD.csv';
utils.input(inFile, function (data) {
  var inRows = data.split('\r\n').slice(3),
      outRows = ['countryCode,year,gdp'];
  inRows.splice(inRows.length - 1, 1);
  inRows.forEach(function (row) {
    var entries = utils.parse(row),
        yearEntries = entries.slice(4, 58),
        countryCode = entries[1];
    yearEntries.forEach(function (value, i) {
      var year = i + 1960;
      if(value.length != 0) {
        outRows.push([countryCode, year, value].join(','));
      }
    });
  });
  utils.output(outFile, outRows.join('\n'));
});
