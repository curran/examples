require(['d3', 'forceDirectedGraph'], function (d3, ForceDirectedGraph) {
  var div = document.getElementById('container'),
      forceDirectedGraph = ForceDirectedGraph(div),
      data = {
        nodes: [
          { type: 'property', name: 'size' },
          { type: 'lambda' },
          { type: 'property', name: 'width' },
        ],
        
        links: [
          { source: 0, target: 1},
          { source: 1, target: 2}
        ]
      };

  forceDirectedGraph.set('data', data);

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
