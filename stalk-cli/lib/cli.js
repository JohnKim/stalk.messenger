var pkg         = require('../package'),
    chalk       = require('chalk'),
    program     = require('commander'),
    commands    = require('./commands');

function cli(args) {
    program.version(pkg.version);

    // TODO !!!!!

}

module.exports = cli;
