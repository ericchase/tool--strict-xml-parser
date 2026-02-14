import { describe, expect, test } from 'bun:test';

describe('canary', () => {
  test('true === true', () => {
    expect(true).toBeTrue();
  });
  test('throw error', () => {
    expect(() => {
      throw new Error();
    }).toThrowError();
  });
});
