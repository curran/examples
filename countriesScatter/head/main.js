require(['model', 'd3', 'udc', 'scatterPlot'], function (Model, d3, udc, ScatterPlot) {
  var udcDataPath = '../../lib/udc-data-v0.0.1/',
      wppPath = udcDataPath + 'united_nations/world_population_prospects_2012/',
      wdiPath = udcDataPath + 'world_bank/world_development_indicators/',
      populationPath = wppPath + 'total_population',
      concordancePath = wppPath + 'locations',
      gdpPath = wdiPath + 'GDP_current_USD',
      div = document.getElementById('container'),
      scatterPlot = ScatterPlot(div),
      xMeasure = 'Population',
      yMeasure = 'GDP (current US$)';

  scatterPlot.set({
    getX: function (d) { return d.values[xMeasure]; },
    getY: function (d) { return d.values[yMeasure]; },
    xLabel: xMeasure,
    yLabel: yMeasure
  });

  loadTable(populationPath, function (populationTable) {
    var populationCube = udc.Cube(populationTable);

    loadTable(gdpPath, function (gdpTable) {
      var gdpCube = udc.Cube(gdpTable);

      loadTable(concordancePath, function (concordanceTable) {
        var thesaurus = udc.Thesaurus([concordanceTable]),
            cube = udc.mergeCubes(populationCube, gdpCube, thesaurus),
            cube2010 = udc.slice(cube, udc.Member('Time', 'year', '2010')),
            data = cube2010.observations.filter(function (observation) {
              var d = observation.values;
              return d[xMeasure] && d[yMeasure];
            });

        scatterPlot.set('data', data);
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

  setSizeFromDiv();

  window.addEventListener('resize', setSizeFromDiv);

  function setSizeFromDiv(){
    scatterPlot.set('size', {
      width: div.clientWidth,
      height: div.clientHeight
    });
  }
});
