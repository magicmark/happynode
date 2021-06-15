#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require("path");
const which = require('npm-which')(__dirname);
const debug = require('debug')('happynode:build');

const [, , ...extraArgs] = process.argv;

// TODO: Maybe use real babel api?
const cli = which.sync('babel');
const config = path.join(__dirname, "..", "..", "babel.config.json");

// prettier-ignore
const args = [
  "--delete-dir-on-start",
  "--copy-files",
  "--out-dir", "build",
  "--extensions", ".ts,.js",
  "--verbose", "src",
  "--config-file", config,
  ...extraArgs,
];

debug(`$ ${cli} ${args.join('" "')}"`);
spawn(cli, args, { stdio: 'inherit' });
