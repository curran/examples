// An generalized version of the D3 scatter plot example:
// http://bl.ocks.org/mbostock/3887118
// By Curran Kelleher 5/6/2014
define(['d3', 'model'], function (d3, Model) {
  return function (div){
    var x = d3.scale.log(),
        y = d3.scale.log(),
        xAxis = d3.svg.axis().scale(x).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left'),
        svg = d3.select(div).append('svg'),
        g = svg.append('g'),
        xAxisG = g.append('g').attr('class', 'x axis'),
        yAxisG = g.append('g').attr('class', 'y axis'),
        xAxisLabel = xAxisG.append('text')
          .attr('class', 'label')
          .attr('y', -6)
          .style('text-anchor', 'end'),
        yAxisLabel = yAxisG.append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end'),
        model = Model();

    model.set('margin', { top: 20, right: 20, bottom: 30, left: 40 });

    model.when('margin', function (margin) {
      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    });

    model.when('size', function (size) {
      svg.attr('width', size.width)
         .attr('height', size.height);
    });

    model.when(['size', 'margin'], function (size, margin) {
      model.set('width', size.width - margin.left - margin.right);
      model.set('height', size.height - margin.top - margin.bottom);
    });

    model.when('width', function (width) {
      xAxisLabel.attr('x', width);
    });

    model.when('height', function (height) {
      xAxisG.attr('transform', 'translate(0,' + height + ')');
    });

    model.when('xLabel', xAxisLabel.text, xAxisLabel);
    model.when('yLabel', yAxisLabel.text, yAxisLabel);

    model.when(['width', 'height', 'data', 'getX', 'getY'], function (width, height, data, getX, getY) {
      var dots;

      x.domain(d3.extent(data, function(d) { return getX(d); })).nice();
      y.domain(d3.extent(data, function(d) { return getY(d); })).nice();

      x.range([0, width]);
      y.range([height, 0]);

      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      dots = g.selectAll('.dot').data(data);
      dots.enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 3.5);
      dots
        .attr('cx', function(d) { return x(getX(d)); })
        .attr('cy', function(d) { return y(getY(d)); });
      dots.exit().remove();
    });
    return model;
  }
});
