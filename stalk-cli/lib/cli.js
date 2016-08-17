var pkg         = require('../package'),
    chalk       = require('chalk'),
    program     = require('commander');

function cli(args) {
    program.version(pkg.version);

    program
      .command('install-session [path]')
      .description('install session server.')
      .option("-g, --global", "install global")
      .action(function(_path, options){

        var installPath = _path ? path.resolve(_path) : process.cwd();
        // TODO
        console.log(installPath);

      }).on('--help', function() {

        console.log('  Examples:');
        console.log();
        console.log('    $ stalk install-session ');
        console.log('    $ stalk install-session /abc/def/gh');
        console.log();

      });

      program.parse(process.argv);

}

module.exports = cli;
