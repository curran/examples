// A Node.js script that transforms `raw.csv` into `../locations.csv`
// Curran Kelleher 5/3/2014
var utils = require('../../../js/utils.js'),
    inFile = 'raw.csv',
    outFile = '../locations.csv',
    indices = {
      countryName: 1,
      unCountryCode: 3,
      alphaCode: 4,
      locationTypeCode: 5,
      locationTypeName: 6,
      regionCode: 7,
      regionName: 8,
      majorAreaCode: 9,
      majorAreaName: 10
    };

utils.input(inFile, function (data) {

  // Split the input CSV into rows
  var rows = data.split('\r\n').slice(1),
      columnNames = [ 'countryName', 'unCountryCode', 'alphaCode' ],
      parsedRows,
      outputRows,
      table;

  // Remove the last entry, which is blank
  rows.splice(rows.length - 1, 1);

  // Parse each line string as CSV
  parsedRows = rows.map(utils.parse);

  // Create CSV data for each parsed row
  outputRows = parsedRows.map(function (entries) {
    return columnNames.map(function (columnName) {
      return utils.unparse(entries[indices[columnName]]);
    }).join(',')
  });

  // Combine column names with CSV data
  table = [columnNames.join(',')].concat(outputRows);

  // Write the output file
  utils.output(outFile, table.join('\n'));
});

