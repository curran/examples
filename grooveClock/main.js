require(["model", "d3", "_"], function (Model, d3, _) {
  var div = document.getElementById("container"),
      clock = GrooveClock(div);

  clock.set("startTime", Date.now());

  setInterval(function (){
    clock.set("audioTime", Date.now());
  }, 20);

  function setSizeFromDiv(){
    clock.set("size", {
      width: div.clientWidth,
      height: div.clientHeight
    });
  }

  // Set size once to initialize
  setSizeFromDiv();

  // Set size on resize
  window.addEventListener("resize", setSizeFromDiv);
 
  function GrooveClock(div){
    var model = Model(),
        svg = d3.select(div).append("svg")
        g = svg.append("g");

    model.set({

      // The current time from the Web Audio API.
      audioTime: 50,

      // The number of levels (an integer).
      //
      // Levels are represented visually as concentric rings.
      //
      // The first level represents the finest detail of rhythm,
      // let's say 16th notes (from the vocabulary of music).
      levels: 10,

      // The data structure that represents the current
      // state of the groove clock.
      //
      // This is an array of numbers. The array index corresponds
      // to the level. The value, referred to as `time`, falls between 
      // 0 and 1, representing how far through the current cycle the clock 
      // is for that level.
      //
      // Each successive level has a cycle whose length in time 
      // is twice as much as the level before it.
      //
      // data = [ time: Double ];
      //
      // The lengths of time represented by each level are computed as follows:
      //
      //  * Level 0 - smallestBeatLength
      //  * Level 1 - smallestBeatLength * 2
      //  * Level 2 - smallestBeatLength * 4
      //  * Level 3 - smallestBeatLength * 8
      //  * Level 4 - smallestBeatLength * 16
      data: [],

      // The length in milliseconds of the finest grained unit of
      // rhythm, represented by level 0.
      smallestBeatLength: 500,

      // The thickness of each concentric ring representing levels (in pixels).
      levelThickness: 50
    });
    
    // Compute the fraction of completion for each level in response
    // to updates of model properties. The `audioTime` will update very
    // frequently, so care was taken to implement this efficiently, avoiding object creation.
    model.when(["startTime", "audioTime", "levels", "smallestBeatLength"],
      (function(){

        // Re-use this array to avoid creating a new array every time
        // audioTime updates.
        var data = [];

        return function (startTime, audioTime, levels, smallestBeatLength) {
          var levelLength, time, i;

          // If the number of levels has decreased,
          if(data.length > levels) {
            // make data have the correct number of entries.
            data.splice(levels);
          }

          // Compute the fraction of completion for each level.
          for(i = 0; i < levels; i++) {
            levelLength = smallestBeatLength * Math.pow(2, i);
            time = (audioTime - startTime) % levelLength;
            data[i] = time / levelLength;
          }

          // Set the computed completion fractions on the model.
          // TODO update to new API
          model.set("data", data);
        };
      }())
    );

    // Update the arc computation function, svg dimensions,
    // and g transform in response to resize or change in number of levels.
    model.when(["size", "levels"], function (size, levels) {
      var side = Math.min(size.width, size.height),
          levelThickness = side / levels / 2,
          arc = d3.svg.arc()
            .innerRadius(function (d, i) { return i * levelThickness; })
            .outerRadius(function (d, i) { return (i + 1) * levelThickness; })
            .startAngle(0)
            .endAngle(function (d) { return d * Math.PI * 2; });

      model.set("arc", arc);

      g.attr("transform", "translate(" + (side / 2) + "," + (side / 2) + ")");

      svg.attr("width", size.width)
         .attr("height", size.height);
    });

    // Visualize the data array as concentric rings.
    model.when(["arc", "data"], function (arc, data) {

      var paths = g.selectAll("path").data(data);
      paths.enter().append("path");
      paths.attr("d", arc);
      paths.exit().remove();

    });

    return model;
  }
});
