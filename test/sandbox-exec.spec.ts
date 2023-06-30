import { list, symbol, str, toString } from "../src/sandbox-exec";

describe('toString function', () => {
  test('should convert symbols correctly', () => {
    const sym = symbol('version');
    expect(toString(sym)).toBe('version');
  });

  test('should convert strings correctly', () => {
    const string = str('hello, world!');
    expect(toString(string)).toBe('"hello, world!"');
  });

  test('should convert lists correctly', () => {
    const l = list(symbol('version'), str('1'));
    expect(toString(l)).toBe('(version "1")');
  });

  test('should convert nested lists correctly', () => {
    const l = list(symbol('allow'), symbol('network*'), list(symbol('regex'), str('*')));
    expect(toString(l)).toBe('(allow network* (regex "*"))');
  });
});

