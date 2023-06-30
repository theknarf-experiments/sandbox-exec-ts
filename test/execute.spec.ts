import {
	list,
	symbol,
	number,
	str,
	toString,
	LispExpression,
	literal,
	regex,
	subpath,
} from "../src/sandbox-exec";
import { executeWithSandboxExec } from "../src/execute";
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';

test('sandbox-exec works end to end', async () => {
	// Create the test file
	const testFilePath = path.join('/tmp', `testfile_${Date.now()}.txt`);
	await fs.writeFile(testFilePath, 'Hello, world!');

	// Create the test script
	const testScriptPath = path.join('/tmp', `testscript_${Date.now()}.js`);
	const testScriptContent = `
	const fs = require('fs');
	fs.readFile('${testFilePath}', 'utf8', (err, data) => {
	if (err) throw err;
	fs.writeFile('${testFilePath}', data + ' And hello again!', err => {
	if (err) throw err;
	});
	});
	`;
	await fs.writeFile(testScriptPath, testScriptContent);

	// Define a sandbox profile
	const sandboxProfile = [
		list(symbol('version'), number(1)),

		// System stuff to allow default stuff
		list(symbol('import'), str("system.sb")),
		list(symbol('import'), str("/System/Library/Sandbox/Profiles/bsd.sb")),

		// Allow node.js
		list(symbol('allow'), symbol('file-map-executable'), subpath("/usr/local")),
		list(symbol('allow'), symbol('file-read*'), subpath("/usr/local")),
		list(symbol('allow'), symbol('process-exec'), subpath("/usr/local")),

		// Allow the test to read our test file and test script
		list(symbol('allow'), symbol('file-read*'),
		 literal(`/private${testFilePath}`),
		 literal(`/private${testScriptPath}`),
		),

		// Allow us to write to the test file
		list(symbol('deny'), symbol('file-write*')),
		list(symbol('allow'), symbol('file-write*'),
		 subpath(`/private${testFilePath}`),
		),
		// PS: I'm not sure why I have to preface the allow rules with /private. Perhaps sandbox-exec symlinks stuff into /private?
	];

	// Execute the test script with sandbox-exec
	try {
		await executeWithSandboxExec(sandboxProfile, `/usr/local/bin/node ${testScriptPath}`);
	} catch (err) {
		throw err;
	}

	const fileContent = await fs.readFile(testFilePath, 'utf8');

	// Clean up the test file and script
	await fs.unlink(testFilePath);
	await fs.unlink(testScriptPath);

	// Validate the result
	expect(fileContent).toBe('Hello, world! And hello again!');
});
