import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Example utility function to test
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

// Regular unit tests
describe('Math Utils', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  it('should multiply two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-1, 5)).toBe(-5);
    expect(multiply(0, 100)).toBe(0);
  });
});

// Property-based tests (like Hypothesis in Python)
describe('Property-based Tests', () => {
  it('addition should be commutative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(add(b, a));
      })
    );
  });

  it('addition should be associative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
        expect(add(add(a, b), c)).toBe(add(a, add(b, c)));
      })
    );
  });

  it('multiplication by zero should always be zero', () => {
    fc.assert(
      fc.property(fc.integer(), a => {
        // Check that the result is zero (handles both 0 and -0)
        expect(multiply(a, 0) === 0).toBe(true);
        expect(multiply(0, a) === 0).toBe(true);
        // Also check that it's not NaN
        expect(Number.isNaN(multiply(a, 0))).toBe(false);
        expect(Number.isNaN(multiply(0, a))).toBe(false);
      })
    );
  });

  it('addition should handle edge cases', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000, max: 1000 }), a => {
        expect(add(a, 0)).toBe(a);
        expect(add(0, a)).toBe(a);
        expect(add(a, -a)).toBe(0);
      })
    );
  });
});
