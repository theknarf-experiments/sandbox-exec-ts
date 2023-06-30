import { writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { toString, LispExpression } from "./sandbox-exec";

/**
 * Writes a lisp expression to a file and executes it with sandbox-exec.
 *
 * @param exprs The array of lisp expressions to execute.
 * @param command The command to be executed under the sandbox.
 * @return A promise that resolves with the output of the command.
 */
async function executeWithSandboxExec(exprs: LispExpression[], command: string): Promise<string> {
  // Convert the lisp expressions to a string
  const code = exprs.map(toString).join('\n');

  // Write the code to a temporary file
  const filename = `/tmp/sandbox_${Date.now()}.sb`;
  await writeFile(filename, code);

  // Run sandbox-exec with the temporary file as input and the command
  return new Promise((resolve, reject) => {
    exec(`sandbox-exec -f ${filename} ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

export {
  executeWithSandboxExec,
};

