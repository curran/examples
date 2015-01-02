require(["model", "d3", "_"], function (Model, d3, _) {
  var div = document.getElementById("container"),
      clock = GrooveClock(div),
      context = new AudioContext(),

      // The milliseconds between breaks in note scheduling.
      pollTime = 60,

      // The seconds ahead of the current time at which 
      // notes are scheduled.
      scheduleAheadTime = 1,

      // The tempo in Beats per Minute (BPM)
      tempo = 110,
      secondsPerBeat = 60 / tempo,

      // The time at which the next note should be scheduled,
      // in seconds, relative to startTime.
      nextNoteTime = 0,

      startTime = 2;

  clock.smallestBeatLength = secondsPerBeat;
  clock.startTime = startTime;

  // Fetch the shaker sample.
  // Draws from http://www.html5rocks.com/en/tutorials/webaudio/intro/
  function loadSample() {
    var request = new XMLHttpRequest();
    request.open('GET', 'ShakerSample.wav', true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        setInterval(function () {
          while (startTime + nextNoteTime < context.currentTime + scheduleAheadTime ) {
            console.log("here");
            playSound(buffer, startTime + nextNoteTime);
            nextNoteTime += secondsPerBeat;
          }
        }, pollTime);
      });
    };
    request.send();
    function playSound(buffer, time) {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(time);
    }
  }

  loadSample();

  // Update the time of the clock periodically.
  function startClock(){
    clock.audioTime = context.currentTime;
    requestAnimationFrame(startClock);
  }
  startClock();

  // Update the size of the groove clock on resize.
  function setSizeFromDiv(){
    clock.size = {
      width: div.clientWidth,
      height: div.clientHeight
    };
  }

  // Set size once to initialize
  setSizeFromDiv();

  // Set size on resize
  window.addEventListener("resize", setSizeFromDiv);
 
  // A GrooveClock encapsulates a multi-level beat clock
  // visualized as concentric arcs using D3.
  function GrooveClock(div){
    var model = Model(),
        svg = d3.select(div).append("svg")
        g = svg.append("g");

    model.set({
      startTime: 0,

      // The current time from the Web Audio API.
      audioTime: 0,

      // The number of levels (an integer).
      //
      // Levels are represented visually as concentric rings.
      //
      // The first level represents the finest detail of rhythm,
      // let's say 16th notes (from the vocabulary of music).
      levels: 8,

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

      // The length in seconds of the finest grained unit of
      // rhythm, represented by level 0.
      smallestBeatLength: 1,

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
          model.data = data;
        };
      }())
    );

    // Update the arc computation function, svg dimensions,
    // and g transform in response to resize or change in number of levels.
    model.when(["size", "levels"], function (size, levels) {
      var side = Math.min(size.width, size.height),
          levelThickness = side / levels / 2;
      
      model.arc = d3.svg.arc()
        .innerRadius(function (d, i) { return i * levelThickness; })
        .outerRadius(function (d, i) { return (i + 1) * levelThickness; })
        .startAngle(0)
        .endAngle(function (d) { return d * Math.PI * 2; });

      g.attr("transform", "translate(" + (side / 2) + "," + (side / 2) + ")");

      svg.attr("width", size.width)
         .attr("height", size.height);
    });

    // Visualize the data array as concentric rings.
    model.when(["arc", "data"], function (arc, data) {

      var paths = g.selectAll("path").data(data);
      paths.enter().append("path");
      paths
        .attr("d", arc)
        .attr("fill", "white");
      paths.exit().remove();

    });

    return model;
  }
});
