# Development Guide

## 🚀 Quick Start

```bash
# Complete development setup
npm run dev:full

# Or step by step
npm run dev:setup  # Setup environment
npm run dev        # Start development server
```

## 🛠️ Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run dev:setup` - Complete development environment setup
- `npm run dev:full` - Setup + start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Testing

- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Open test UI
- `npm run test:coverage` - Run tests with coverage
- `npm run test:coverage:ui` - Coverage with UI
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:ui` - E2E tests with UI
- `npm run test:e2e:debug` - Debug E2E tests
- `npm run test:all` - Run all tests
- `npm run test:ci` - CI test suite

### Maintenance

- `npm run clean` - Clean build artifacts
- `npm run clean:all` - Clean everything including node_modules
- `npm run reinstall` - Clean and reinstall dependencies
- `npm run audit` - Security audit
- `npm run audit:fix` - Fix security issues
- `npm run deps:check` - Check for outdated dependencies
- `npm run deps:update` - Update dependencies
- `npm run analyze` - Bundle analysis

## 🧪 Testing

### Unit Tests

- Uses Vitest with React Testing Library
- Located in `test/` directory
- Mock service worker (MSW) for API mocking
- Custom test utilities in `test/test-utils.tsx`

### E2E Tests

- Uses Playwright
- Located in `e2e/` directory
- Tests multiple browsers and devices
- Visual regression testing support

### Test Coverage

- Minimum 80% coverage required
- Coverage reports in `coverage/` directory
- HTML coverage report available

## 🔧 Code Quality

### ESLint Rules

- Next.js recommended rules
- TypeScript ESLint rules
- React hooks rules
- Custom rules for consistency

### Prettier

- Consistent code formatting
- Integrated with ESLint
- Runs on pre-commit

### TypeScript

- Strict mode enabled
- Path aliases configured
- Advanced type checking rules

## 🚀 CI/CD

### Pre-commit Hooks

- ESLint + Prettier on staged files
- TypeScript type checking
- Automatic code formatting

### Pre-push Hooks

- Full test suite
- Type checking
- Linting

### GitHub Actions

- Multi-Node.js version testing
- Security auditing
- Performance analysis
- Automated deployment

## 📁 Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities and services
├── test/                   # Unit tests
├── e2e/                    # E2E tests
├── .github/workflows/      # CI/CD pipelines
├── .husky/                 # Git hooks
└── scripts/                # Development scripts
```

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# AI Services
OPENAI_API_KEY=your_openai_key

# External APIs
EXERCISEDB_API_KEY=your_exercisedb_key
YOUTUBE_API_KEY=your_youtube_key
```

## 🐛 Debugging

### VS Code

- TypeScript debugging configured
- ESLint integration
- Prettier integration
- Test debugging support

### Browser DevTools

- React DevTools
- Redux DevTools (if using)
- Network tab for API debugging

### Testing

- `npm run test:ui` - Interactive test runner
- `npm run test:e2e:debug` - Debug E2E tests
- Browser DevTools in test mode

## 📊 Performance

### Bundle Analysis

- `npm run analyze` - Analyze bundle size
- Webpack Bundle Analyzer integration
- Performance monitoring

### Monitoring

- Vercel Analytics (if enabled)
- Custom performance metrics
- Error tracking

## 🔒 Security

### Dependencies

- Regular security audits
- Automated vulnerability scanning
- Dependency updates

### Code

- ESLint security rules
- TypeScript strict mode
- Input validation

## 🚀 Deployment

### Vercel

- Automatic deployment on push
- Environment variables configured
- Preview deployments for PRs

### Manual

- `npm run build` - Build for production
- Deploy `.next` directory
- Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Commit with conventional commits
6. Push and create a PR

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
