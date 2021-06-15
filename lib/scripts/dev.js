#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const which = require('npm-which')(__dirname);
const debug = require('debug')('happynode:dev');

const [, , ...extraArgs] = process.argv;

const cli = which.sync('concurrently');
const build = path.join(__dirname, 'build.js');
const serve = path.join(__dirname, 'serve.js');

// prettier-ignore
const args = [
    "--names", "build,serve",
    `${build} --watch`, serve, 
    ...extraArgs,
];

debug(`$ ${cli} ${args.join('" "')}"`);
spawn(cli, args, { stdio: 'inherit' });
