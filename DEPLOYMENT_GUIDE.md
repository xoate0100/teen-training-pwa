# Teen Training PWA - Deployment Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Alternative Platforms](#alternative-platforms)
- [Database Setup](#database-setup)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers the complete deployment process for the Teen Training PWA, from initial setup to production monitoring. The application is designed to be deployed on modern hosting platforms with support for Next.js, PostgreSQL, and PWA features.

### Deployment Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Supabase)    │
│   PWA Features  │    │   AI Integration│    │   Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   External APIs │
                    │   OpenAI        │
                    │   ExerciseDB    │
                    │   YouTube       │
                    └─────────────────┘
```

---

## ✅ Pre-deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run test:api`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] TypeScript compilation clean
- [ ] All environment variables documented

### Database
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Seed data loaded
- [ ] RLS policies configured
- [ ] Backup strategy in place

### External Services
- [ ] OpenAI API key obtained
- [ ] ExerciseDB API key (optional)
- [ ] YouTube API key (optional)
- [ ] All API keys tested

### PWA Features
- [ ] Service worker registered
- [ ] Manifest.json configured
- [ ] Offline functionality tested
- [ ] Installation prompts working

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env.local` file for development or configure in your hosting platform:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your_openai_key

# ExerciseDB API (OPTIONAL)
EXERCISEDB_API_KEY=your_exercisedb_key

# YouTube API (OPTIONAL)
YOUTUBE_API_KEY=your_youtube_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### Environment Variable Security

#### Development
- Store in `.env.local` (gitignored)
- Never commit API keys to version control
- Use different keys for dev/staging/production

#### Production
- Use platform-specific secret management
- Rotate keys regularly
- Monitor API usage and costs

---

## 🚀 Vercel Deployment (Recommended)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Git Repository
```bash
# Link to existing project
vercel link

# Deploy
vercel --prod
```

### 4. Configure Environment Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables
5. Redeploy the project

### 5. Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 6. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records
4. Enable SSL certificate

---

## 🌐 Alternative Platforms

### Netlify

#### 1. Connect Repository
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings

#### 2. Build Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. Environment Variables
- Go to Site Settings → Environment Variables
- Add all required variables
- Redeploy the site

### Railway

#### 1. Deploy from GitHub
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the project

#### 2. Configure Environment
```bash
# Add environment variables
railway variables set NEXT_PUBLIC_SUPABASE_URL=your_url
railway variables set OPENAI_API_KEY=your_key
```

#### 3. Deploy
```bash
railway up
```

### AWS Amplify

#### 1. Connect Repository
1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Configure build settings

#### 2. Build Configuration
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## 🗄️ Database Setup

### Supabase Production Setup

#### 1. Create Production Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a region close to your users
4. Set up billing (if needed)

#### 2. Apply Database Schema
```bash
# Using the provided script
npm run db:init

# Or manually via SQL Editor
# Copy and run lib/database/schema.sql
```

#### 3. Configure Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

#### 4. Set Up Backups
1. Go to Settings → Database
2. Enable automatic backups
3. Configure backup retention
4. Test restore process

### Database Migration Strategy

#### Development to Production
1. Export schema from development
2. Apply to production database
3. Migrate data (if needed)
4. Update environment variables
5. Test all functionality

#### Version Control
```bash
# Create migration files
mkdir migrations
touch migrations/001_initial_schema.sql
touch migrations/002_add_indexes.sql
```

---

## 🌍 Domain Configuration

### Custom Domain Setup

#### 1. DNS Configuration
```dns
# A record
@ 300 IN A 76.76.19.61

# CNAME record
www 300 IN CNAME your-domain.com

# Subdomain (optional)
api 300 IN CNAME api.your-domain.com
```

#### 2. SSL Certificate
- Most platforms provide automatic SSL
- Use Let's Encrypt for custom setups
- Monitor certificate expiration

#### 3. CDN Configuration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

## 📊 Monitoring & Analytics

### Application Monitoring

#### Vercel Analytics
```javascript
// Enable in next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
};
```

#### Custom Monitoring
```javascript
// lib/monitoring.js
export function trackEvent(event, properties) {
  if (typeof window !== 'undefined') {
    // Send to analytics service
    analytics.track(event, properties);
  }
}
```

### Database Monitoring

#### Supabase Dashboard
- Monitor query performance
- Track API usage
- Set up alerts for errors
- Monitor storage usage

#### Custom Alerts
```sql
-- Set up database alerts
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS void AS $$
BEGIN
  -- Check for failed queries
  -- Monitor connection count
  -- Alert on high error rates
END;
$$ LANGUAGE plpgsql;
```

### Performance Monitoring

#### Core Web Vitals
```javascript
// lib/analytics.js
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

#### API Performance
```javascript
// Monitor API response times
const start = Date.now();
const response = await fetch('/api/sessions');
const duration = Date.now() - start;
console.log(`API call took ${duration}ms`);
```

---

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Check build logs
vercel logs your-deployment-url

# Common fixes
npm install --legacy-peer-deps
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variable Issues
```bash
# Verify variables are set
vercel env ls

# Test in development
npm run dev
```

#### Database Connection Issues
```javascript
// Test database connection
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.from('users').select('*');
console.log('Database connection:', error ? 'Failed' : 'Success');
```

### Performance Issues

#### Bundle Size Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize images
npm install next-optimized-images
```

#### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_check_ins_date ON daily_check_ins(date);
```

### PWA Issues

#### Service Worker Problems
```javascript
// Check service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('SW ready:', registration);
  });
}
```

#### Offline Functionality
```javascript
// Test offline functionality
window.addEventListener('online', () => {
  console.log('Back online');
  // Sync pending data
});

window.addEventListener('offline', () => {
  console.log('Gone offline');
  // Show offline indicator
});
```

---

## 📈 Post-Deployment

### Health Checks

#### Automated Health Checks
```javascript
// pages/api/health.js
export default function handler(req, res) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // Check database connection
    apis: 'functional' // Check external APIs
  };
  
  res.status(200).json(health);
}
```

#### Monitoring Setup
1. Set up uptime monitoring
2. Configure error tracking
3. Set up performance monitoring
4. Create alerting rules

### Maintenance

#### Regular Tasks
- [ ] Monitor API usage and costs
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys
- [ ] Backup database weekly
- [ ] Monitor performance metrics

#### Security Updates
- [ ] Keep dependencies updated
- [ ] Monitor security advisories
- [ ] Regular security audits
- [ ] Update API keys regularly

---

## 🎉 Success Metrics

### Deployment Success Criteria
- [ ] Application loads in <3 seconds
- [ ] All API endpoints responding
- [ ] Database queries <100ms average
- [ ] PWA features working offline
- [ ] No critical errors in logs
- [ ] SSL certificate valid
- [ ] Mobile responsiveness verified

### Performance Targets
- **Lighthouse Score**: >90 across all metrics
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

---

*Last Updated: December 2024*
*Deployment Version: 1.0.0*
