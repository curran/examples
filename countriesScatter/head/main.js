// This program integrates two data cubes together and visualizes
// the merged cube using a scatter plot. The two data cubes are:
//
//  * United Nations - World Population Prospects - Total Population
//  * World Bank - World Development Indicators - Gross Domestic Product
//
// These data cubes use different identifiers to refer to countries, which 
// are resolved using a concorcance table provided by the United Nations.
require(['model', 'd3', 'udc', 'scatterPlot', 'q'], function (Model, d3, udc, ScatterPlot, Q) {
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

  Q.all([
    loadTable(populationPath),
    loadTable(gdpPath),
    loadTable(concordancePath),
  ]).spread(function (populationTable, gdpTable, concordanceTable) {
    var populationCube = udc.Cube(populationTable),
        gdpCube = udc.Cube(gdpTable),
        thesaurus = udc.Thesaurus([concordanceTable]),
        cube = udc.mergeCubes(populationCube, gdpCube, thesaurus),
        cube2010 = udc.slice(cube, udc.Member('Time', 'year', '2010')),
        data = cube2010.observations.filter(function (observation) {
          var d = observation.values;
          return d[xMeasure] && d[yMeasure];
        });
    scatterPlot.set('data', data);

    console.log(toCSV(data.map(function(d){
      return {
        country_code: d.cell.members[0].code,
        population: d.values[xMeasure],
        gdp: d.values[yMeasure]
      };
    })));

  });


  function toCSV(data){
    var columns = Object.keys(data[0]);
    return [columns.join(",")].concat(data.map(function(d){
      return columns.map(function(column){
        return d[column];
      }).join(",");
    })).join("\n");
  }

  function loadTable(path, callback){
    return Q.all([
      load(d3.csv, path + '.csv'),
      load(d3.json, path + '.json')
    ]).spread(function (rows, table) {
      table.rows = rows;
      return table;
    });
  } 

  function load(loader, path){
    var deferred = Q.defer();
    loader(path, function (error, data) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(data);
      }
    });
    return deferred.promise;
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
