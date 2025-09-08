#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up development environment...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local from .env.example...');
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env.local');
    console.log(
      '✅ .env.local created. Please update with your actual values.'
    );
  } else {
    console.log(
      '⚠️  .env.example not found. Please create .env.local manually.'
    );
  }
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully.');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Run type check
console.log('🔍 Running type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed.');
} catch (error) {
  console.log('⚠️  Type check failed. Please fix TypeScript errors.');
}

// Run linting
console.log('🧹 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed.');
} catch (error) {
  console.log('⚠️  Linting failed. Please fix ESLint errors.');
}

// Run tests
console.log('🧪 Running tests...');
try {
  execSync('npm run test:run', { stdio: 'inherit' });
  console.log('✅ Tests passed.');
} catch (error) {
  console.log('⚠️  Some tests failed. Please check test results.');
}

console.log('\n🎉 Development environment setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env.local with your actual API keys');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Run "npm run test:ui" to open the test UI');
console.log('4. Run "npm run test:e2e:ui" to open Playwright UI');
