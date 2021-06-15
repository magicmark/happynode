#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const debug = require('debug')('happynode');

const scripts = {
    build: path.join(__dirname, 'scripts', 'build.js'),
    dev: path.join(__dirname, 'scripts', 'dev.js'),
    serve: path.join(__dirname, 'scripts', 'serve.js'),
};

function main(argv) {
    const [, , command, ...args] = argv;

    if (!['build', 'dev', 'serve'].includes(command)) {
        throw new Error(`command not recognized: ${command}`);
    }

    const cli = scripts[command];

    debug(`$ ${cli} ${args.join('" "')}"`);
    spawn(cli, args, { stdio: 'inherit' });
}

main(process.argv);
