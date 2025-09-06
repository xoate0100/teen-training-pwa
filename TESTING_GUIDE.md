# 🧪 Testing & Code Quality Guide

This guide covers the comprehensive testing and code quality setup for your Next.js/TypeScript project, similar to Python's Hypothesis and flake8.

## 🎯 **Overview**

We've set up a complete testing ecosystem that includes:

- **Unit Testing**: Vitest (faster alternative to Jest)
- **Component Testing**: React Testing Library
- **Property-Based Testing**: fast-check (JavaScript equivalent of Hypothesis)
- **End-to-End Testing**: Playwright
- **Code Quality**: ESLint + Prettier + TypeScript
- **Git Hooks**: Husky + lint-staged

## 🚀 **Quick Start**

```bash
# Run all unit tests
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run end-to-end tests
npm run test:e2e

# Run all tests
npm run test:all

# Format code
npm run format

# Check code formatting
npm run format:check

# Lint code
npm run lint
```

## 📋 **Available Scripts**

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm run test`          | Run tests in watch mode          |
| `npm run test:ui`       | Run tests with interactive UI    |
| `npm run test:run`      | Run tests once                   |
| `npm run test:coverage` | Run tests with coverage report   |
| `npm run test:e2e`      | Run end-to-end tests             |
| `npm run test:e2e:ui`   | Run E2E tests with UI            |
| `npm run test:all`      | Run both unit and E2E tests      |
| `npm run format`        | Format all code with Prettier    |
| `npm run format:check`  | Check code formatting            |
| `npm run lint`          | Lint code with ESLint            |
| `npm run lint:fix`      | Fix linting issues automatically |

## 🔬 **Testing Types**

### 1. **Unit Tests** (Vitest)

**Location**: `test/` directory

**Example**:

```typescript
// test/utils.test.ts
import { describe, it, expect } from 'vitest';

describe('Math Utils', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### 2. **Component Tests** (React Testing Library)

**Location**: `test/` directory

**Example**:

```typescript
// test/components.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

### 3. **Property-Based Tests** (fast-check - like Hypothesis)

**Location**: `test/` directory

**Example**:

```typescript
// test/utils.test.ts
import * as fc from 'fast-check';

describe('Property-based Tests', () => {
  it('addition should be commutative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(add(b, a));
      })
    );
  });
});
```

**Why Property-Based Testing?**

- Automatically generates test cases
- Finds edge cases you didn't think of
- Discovers bugs like the `-0` vs `0` issue we found
- Similar to Python's Hypothesis library

### 4. **End-to-End Tests** (Playwright)

**Location**: `e2e/` directory

**Example**:

```typescript
// e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('should load the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Teen Training Program/);
});
```

## 🛠 **Code Quality Tools**

### 1. **ESLint** (like flake8)

**Configuration**: `.eslintrc.json`

**Features**:

- Catches bugs and code issues
- Enforces coding standards
- Integrates with Prettier
- Works with TypeScript

### 2. **Prettier** (Code Formatting)

**Configuration**: `.prettierrc`

**Features**:

- Consistent code formatting
- Automatic code style enforcement
- Integrates with ESLint

### 3. **TypeScript** (Type Safety)

**Configuration**: `tsconfig.json`

**Features**:

- Static type checking
- Catches type-related bugs
- Better IDE support
- Compile-time error detection

## 🔧 **Configuration Files**

### Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    css: true,
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## 🎯 **Best Practices**

### 1. **Writing Tests**

- Write tests for utility functions first
- Test component behavior, not implementation
- Use descriptive test names
- Keep tests simple and focused

### 2. **Property-Based Testing**

- Use for mathematical operations
- Test invariants and properties
- Let fast-check find edge cases
- Fix bugs that property tests find

### 3. **Code Quality**

- Run `npm run format` before committing
- Fix linting errors immediately
- Use TypeScript strict mode
- Write self-documenting code

## 🚨 **Git Hooks** (Husky)

**Pre-commit**: Runs linting and formatting
**Pre-push**: Runs unit tests

**Configuration**: `.husky/pre-commit` and `.husky/pre-push`

## 📊 **Coverage Reports**

```bash
# Generate coverage report
npm run test:coverage
```

## 🔍 **Debugging Tests**

### Vitest UI

```bash
npm run test:ui
```

### Playwright UI

```bash
npm run test:e2e:ui
```

## 🎉 **Success Example**

Our property-based test found a real bug! The test discovered that `-1 * 0` equals `-0` (negative zero) in JavaScript, not `0`. This is exactly what property-based testing is designed to do - find edge cases you didn't think of.

## 📚 **Resources**

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [fast-check Documentation](https://fast-check.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## 🎯 **Next Steps**

1. **Write more tests** for your existing components
2. **Add property-based tests** for your utility functions
3. **Create E2E tests** for critical user flows
4. **Set up CI/CD** to run tests automatically
5. **Monitor test coverage** and aim for >80%

---

**Happy Testing! 🧪✨**
