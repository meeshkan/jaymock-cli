#!/usr/bin/env node
'use strict';
const meow = require('meow');
const logSymbols = require('log-symbols');
const jaymock = require('@unmock/jaymock');
const ora = require('ora');
const getStdin = require('get-stdin');
const execa = require('execa');

const jm = jaymock();

const cli = meow(`
	Usage
	  $ jaymock <text> [--json]
	  $ cat <file> | jaymock [--json]
	  $ jaymock --server [--port <number>]
    
	Options
	  --json, -j    Print output in JSON format
	  --server, -s  Start a development server for API mocking
	  --port, -p    Specify a port number for the server
    
	Examples
	  $ jaymock '{"firstName":"name.firstName", "lastName":"name.lastName"}'
	  {
	    "firstName": "Alvina",
	    "lastName": "Hodkiewicz"
	  }
	  $ jaymock '{"firstName":"name.firstName", "lastName":"name.lastName"}' --json
	  {"firstName":"Anthony","lastName":"Krajcik"}
	  $ jaymock --server --port 1337
`, {
	flags: {
		json: {
			type: 'boolean',
			alias: 'j',
			default: false
		},
		server: {
			type: 'boolean',
			alias: 's',
			default: false
		},
		port: {
			type: 'number',
			alias: 'p',
			default: 3000
		}
	}
});

const input = cli.input[0];
const {json, server, port} = cli.flags;

const defaultArguments = ['run', 'dev', '--prefix', __dirname];
const serverArguments = (port === 3000) ? defaultArguments : defaultArguments.concat(['--', '--', '-p', port]);

const display = data => {
	let output;
	if (data.message) {
		output = json ? JSON.stringify({error: data.message}) : `${logSymbols.error} ${data.message}`;
	} else {
		output = json ? JSON.stringify(data) : data;
	}

	console.log(output);
};

if (!input && !server && (process.stdin.isTTY || process.env.isTTY)) {
	display(new Error('Specify a JSON template object'));

	process.exit(1);
}

const loadingMessage = server ? 'Starting the development server…' : 'Generating fake data…';
const spinner = ora(loadingMessage).start();

(async () => {
	if (server) {
		const subprocess = execa('npm', serverArguments, {env: {FORCE_COLOR: true}});
		subprocess.stdout.pipe(process.stdout);
		spinner.stop();
	} else {
		const template = input ? input : await getStdin();
		const populated = jm.populate(JSON.parse(template));
		spinner.stop();
		display(populated);
	}
})().catch(error => {
	spinner.stop();
	display(error);
	process.exit(1);
});
