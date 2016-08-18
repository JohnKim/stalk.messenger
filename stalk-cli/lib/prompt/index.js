var inquirer = require('inquirer');
var Spinner = require('./spinner');

var prompt = inquirer.createPromptModule({
    input:  process.stdin,
    output: process.stdout
});

var options = {};
options.stream = process.stdout;

var spinner = new Spinner(options);
spinner.start();

setTimeout(function(){ spinner.succeed(); }, 3000);
