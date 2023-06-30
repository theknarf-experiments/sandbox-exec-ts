/**
 * This module provides a functional interface to generate sandbox-exec lisp code. 
 * It uses JSON as its internal representation and aims to help 
 * developers programmatically generate lisp code that can be executed by the sandbox-exec on MacOS.
 *
 * @module sandbox-exec
 */

export type LispExpression = string | LispExpression[];

/**
 * Helper function to create a lisp number.
 *
 * @param num The number content.
 * @return The newly created number.
 */
function number(num: number): LispExpression {
  return num.toString();
}

/**
 * Helper function to create a lisp list.
 *
 * @param elements The elements of the list.
 * @return The newly created list.
 */
function list(...elements: LispExpression[]): LispExpression {
  return elements;
}

/**
 * Helper function to create a lisp symbol.
 *
 * @param symbol The symbol string.
 * @return The newly created symbol.
 */
function symbol(symbol: string): LispExpression {
  return symbol;
}

/**
 * Helper function to create a lisp string.
 *
 * @param str The string content.
 * @return The newly created string.
 */
function str(str: string): LispExpression {
  // Escape the string
  const escapedStr = str.replace(/"/g, '\\"');
  return `"${escapedStr}"`;
}

/**
 * Converts a lisp expression to a string.
 *
 * @param expr The lisp expression to convert.
 * @return The string representation of the lisp expression.
 */
function toString(expr: LispExpression): string {
  if (Array.isArray(expr)) {
    return "(" + expr.map(toString).join(' ') + ")";
  } else {
    return expr;
  }
}

/**
 * Helper function to create a lisp literal.
 *
 * @param str The string content.
 * @return The newly created literal.
 */
function literal(str1: string): LispExpression {
  return ['literal', str(str1)];
}

/**
 * Helper function to create a lisp regex.
 *
 * @param regex The regex content.
 * @return The newly created regex.
 */
function regex(regex: string): LispExpression {
  return ['regex', regex];
}

/**
 * Helper function to create a lisp subpath expression.
 *
 * @param path The subpath.
 * @return The newly created subpath expression.
 */
function subpath(path: string): LispExpression {
  return ['subpath', str(path)];
}

export {
  list,
  symbol,
	number,
  str,
  toString,
	literal,
	regex,
	subpath,
};
