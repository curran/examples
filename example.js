var argv = require('minimist')(process.argv.slice(2)),
    mkdirp = require('mkdirp'),
    methods = {
      'create': function(exampleName){
        console.log('create ' + exampleName);
        mkdirp(exampleName + '/head');
      }
    };

methods[argv._[0]].apply(null, argv._.slice(1));

