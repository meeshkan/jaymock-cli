import test from 'ava';
import execa from 'execa';

const fixtures = {
	validInput: '{"name": "name.firstName"}',
	invalidInput: 'unicorn'
};
const regex = {
	validInput: /{ name: '\w+' }/,
	invalidInput: /Unexpected token \w in JSON at position \d/,
	emptyInput: /Specify a JSON template object/,
	serverOutput: /Micro is running/,
	serverPortOutput: /localhost:1337/
};

test('realistic version', async t => {
	const {stdout} = await execa('./cli.js', ['--version']);
	t.true(stdout.length > 0);
});

test('empty input', async t => {
	const {stdout} = await t.throwsAsync(execa('./cli.js', {env: {isTTY: true}}));
	t.regex(stdout, regex.emptyInput);
});

test('main', async t => {
	const {stdout} = await execa('./cli.js', [fixtures.validInput]);
	t.regex(stdout, regex.validInput);
});

test('stdin', async t => {
	const input = fixtures.validInput;
	const {stdout} = await execa('./cli.js', {input});
	t.regex(stdout, regex.validInput);
});

test('--json flag', async t => {
	const {stdout} = await execa('./cli.js', [fixtures.validInput, '--json']);
	t.truthy(JSON.parse(stdout).name);
});

test('invalid JSON', async t => {
	const {stdout} = await t.throwsAsync(execa('./cli.js', [fixtures.invalidInput]));
	t.regex(stdout, regex.invalidInput);
});

test('invalid JSON w/ --json flag', async t => {
	const {stdout} = await t.throwsAsync(execa('./cli.js', [fixtures.invalidInput, '--json']));
	t.regex(JSON.parse(stdout).error, regex.invalidInput);
});

test('--server flag', async t => {
	const subprocess = execa('./cli.js', ['--server']);
	setTimeout(() => {
		subprocess.kill('SIGTERM', {
			forceKillAfterTimeout: 10000
		});
	}, 15000);
	const {stdout} = await t.throwsAsync(subprocess);
	t.regex(stdout, regex.serverOutput);
});

test('server with --port flag', async t => {
	const subprocess = execa('./cli.js', ['--server', '--port', '1337']);
	setTimeout(() => {
		subprocess.kill('SIGTERM', {
			forceKillAfterTimeout: 10000
		});
	}, 15000);
	const {stdout} = await t.throwsAsync(subprocess);
	t.regex(stdout, regex.serverPortOutput);
});
