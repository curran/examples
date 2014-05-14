require(['d3', 'forceDirectedGraph'], function (d3, ForceDirectedGraph) {
  var div = document.getElementById('container'),
      forceDirectedGraph = ForceDirectedGraph(div);

  setInterval(function () {
    forceDirectedGraph.set('color', [
      d3.scale.category20,
      d3.scale.category20b,
      d3.scale.category20c
    ][Math.floor(Math.random() * 3)]());;
  }, 1200);

  setInterval(function () {
    forceDirectedGraph.set({
      'charge': -120 + Math.random() * 50,
      'linkDistance': 30 + Math.random() * 20
    });
  }, 1600);
  forceDirectedGraph.set('data', {
    nodes: [
      { name: 'size' },
      { name: 'lambda' }
    ],
    
    links: [
      { source: 0, target: 1}
    ]
  });

  setSizeFromDiv();
  window.addEventListener('resize', setSizeFromDiv);
  function setSizeFromDiv(){
    forceDirectedGraph.set('box', {
      x: 0,
      y: 0,
      width: div.clientWidth,
      height: div.clientHeight
    });
  }
});
