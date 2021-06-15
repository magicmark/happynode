#!/usr/bin/env node

const execa = require('execa');
const chalk = require('chalk');
const path = require('path');
const which = require('npm-which')(__dirname);
const debug = require('debug')('happynode:serve');

const [, , ...extraArgs] = process.argv;

const cli = which.sync('nodemon');
const config = path.join(__dirname, '..', '..', 'nodemon.json');
const executable = path.join(process.cwd(), 'build', 'index.js');

/**
 * TODO: improvements:
 * - add an --autokill command to do this on startup
 * - use lsof -i @host:port to find the real naughty process
 * - use pstree / ps -o ppid= -p to find a parent process
 */
function findOldNodemon() {
    const command = `ps aux | grep "${cli}" | grep -v "grep""`;
    let subprocess;

    try {
        subprocess = execa.commandSync(command, { shell: true });
    } catch (err) {
        return [];
    }

    const { stdout } = subprocess;
    const pids = stdout
        .split('\n')
        .map((line) => {
            return line.split(/\s+/)[1];
        })
        .join(' ');

    return [command, stdout, pids];
}

// prettier-ignore
const args = [
  "--config", config,
  // TODO: not rely on dotenv? can also do export FOO=bar for nodemon to send env variables
  "--exec", `node -r dotenv/config "${executable}"`,
  ...extraArgs,
];

debug('Waiting 5 seconds to start...');

setTimeout(
    () => {
        debug(`$ ${cli} ${args.join('" "')}"`);

        // don't `{ stdio: 'inherit' } so we can spy on the output.
        const subprocess = execa(cli, args);
        subprocess.stderr.pipe(process.stderr);
        subprocess.stdout.pipe(process.stdout);

        subprocess.stderr.on('data', (data) => {
            if (/EADDRINUSE: address already in use/.test(data)) {
                console.log(
                    `${chalk.blue.bold(
                        '[happynode:serve]',
                    )} EADDRINUSE implies an old version of this process is already running. Here's what I found:\n`,
                );

                // TODO: actually this is probably too fiddly to maintain and catch all edge cases. let's just show the output of lsof.
                const [command, stdout, pid] = findOldNodemon();
                console.log(chalk.dim(`$ ${command}`));
                console.log(chalk.dim(stdout));

                console.log('\nTo recover, run the following and try again:');
                console.log(`\n    ${chalk.yellow('$ kill', pid)}\n`);
            }
        });
    },
    // TODO: use some other way of detecting when babel has finished compiling all files
    5000,
);
