// This script should be used to create and release examples.
// It does the following:
//
//  * creates a consistent directory structure across examples,
//  * maintains the examples.json file,
//  * creates the example thumbnails, and
//  * updates README.md with up to date thumbnails and links.
//
// Usage:
//
//  * node example.js create myExample
//    * creates a myExample directory, start working on 
//      the example in myExample/head.
//    * updates examples.json with the new example metadata.
//  * node example.js release myExample
//    * copies myExample/head into myExample/v1 the first time,
//      into myExample/v2 the second time, ...
//    * updates examples.json with the new release metadata.
//  * node example.js build
//    * generates updated thumbnails
//    * generates README.md from:
//      * README_template.md,
//      * examples.json, and
//      * updated thumbnails
//
// By Curran Kelleher 5/10/2014
var argv = require('minimist')(process.argv.slice(2)),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    generateImages = require('./example/generateImages.js'),
    buildREADME = require('./example/buildREADME.js'),
    methods = {
      'create': function(exampleName){
        mkdirp(exampleName + '/head');
      },
      'release': function(exampleName){
        var version = fs.readdirSync(exampleName).filter(function (dir) {
              return dir[0] === 'v';
            }).length + 1,
            src = exampleName + '/head',
            dest = exampleName + '/v' + version;
        ncp(src, dest);
      },
      'build': function(){
        var data = [
          {
            name: 'countriesScatter',
            latest: 'v1'
          }
        ];

        // TODO use listing of examples from examples.json
        // TODO for each example
        data.forEach(function (entry) {
          var example = entry.name + '/' + entry.latest;
          generateImages(example, function () {
            console.log('Done generating images.');
          });
        });

        buildREADME(data);
      },
    };

methods[argv._[0]].apply(null, argv._.slice(1));
