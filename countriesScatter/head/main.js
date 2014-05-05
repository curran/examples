require(['model', 'd3', 'udc'], function (Model, d3, udc) {
  var udcDataPath = '../../lib/udc-data-v0.0.1/',
      wppPath = udcDataPath + 'united_nations/world_population_prospects_2012/',
      wdiPath = udcDataPath + 'world_bank/world_development_indicators/',
      populationPath = wppPath + 'total_population',
      concordancePath = wppPath + 'locations',
      gdpPath = wdiPath + 'GDP_current_USD';

  loadTable(populationPath, function (populationTable) {
    var populationCube = udc.Cube(populationTable);

    loadTable(gdpPath, function (gdpTable) {
      var gdpCube = udc.Cube(gdpTable);

      loadTable(concordancePath, function (concordanceTable) {
        var thesaurus = udc.Thesaurus([concordanceTable]),
            cube = udc.mergeCubes(populationCube, gdpCube, thesaurus);

        console.log(cube);
      });
    });
  });

  // TODO use promises
  function loadTable(path, callback){
    d3.csv(path + '.csv', function (rows) {
      d3.json(path + '.json', function (table) {
        table.rows = rows;
        callback(table);
      });
    });
  }
});
