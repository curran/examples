var argv = require('minimist')(process.argv.slice(2)),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
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
      }
    };

methods[argv._[0]].apply(null, argv._.slice(1));
