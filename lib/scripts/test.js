#!/usr/bin/env node
const fs = require('fs');
const execa  = require('execa');

// const spawn = require('spawn-command');
const treeKill = require("tree-kill");
// const { spawn, execFile } = require("child_process");
const findUp = require("find-up");
const [, , ...extraArgs] = process.argv;

var onExit = require('signal-exit')


let subprocess;

onExit(function (code, signal) {
  console.log(`process exited! code: ${code}, signal: ${signal}`)
//   treeKill(subprocess.pid, signal);
})


// // Yeah this probably isn't the best way to do this
// // TODO: Figure out how to make require.resolve spit out something in node_modules/.bin
// // OR: Convert to using the real babel node api...
// const babelCli = findUp.sync("node_modules/.bin/babel");

// const babelArgs = [
//   "--delete-dir-on-start",
//   "--copy-files",
//   "--out-dir build",
//   "--extensions '.ts,.js'",
//   "--verbose src",
//   ...extraArgs,
// ];

// process.on("exit", (code) => {
//   console.log(`getting killed!`);
//     fs.writeFileSync('killing', `killing with code: ${code}`);
// //   treeKill(subprocess.pid);
// });


subprocess = execa("htop", [], { 
    //detached: true,
    stdio: {'inherit'
});
// subprocess.unref()

// process.on("exit", (code) => {
//     fs.writeFileSync('killing', `killing with code: ${code}`);
//   console.log(`killing proc: ${subprocess.pid}`);
// //   treeKill(subprocess.pid);
// });
