# Teen Training PWA - App Setup & Configuration Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [API Configuration](#api-configuration)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

---

## 🎯 Overview

The Teen Training PWA is a comprehensive athletic training application designed specifically for young athletes. It features:

- **AI-Powered Adaptation**: Personalized training based on wellness data
- **11-Week Periodization**: Structured training program with automatic progression
- **Safety Monitoring**: Real-time fatigue tracking and injury prevention
- **PWA Capabilities**: Offline functionality and native app experience
- **ADHD-Friendly Design**: Simplified interfaces and engagement features

---

## 🔧 Prerequisites

### Required Software
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code, Cursor, or similar

### Required Accounts
- **Supabase Account**: For database and authentication
- **OpenAI Account**: For AI-powered features
- **ExerciseDB API Key**: For exercise library (optional)
- **YouTube API Key**: For exercise videos (optional)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/xoate0100/teen-training-pwa.git
cd teen-training-pwa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy the environment template
cp .env.example .env.local

# Edit the environment file with your API keys
# See Environment Configuration section below
```

### 4. Database Initialization
```bash
# Set up the database schema and seed data
npm run db:init
```

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key

# ExerciseDB API (OPTIONAL - for external exercise library)
EXERCISEDB_API_KEY=your_exercisedb_api_key

# YouTube API (OPTIONAL - for exercise demonstration videos)
YOUTUBE_API_KEY=your_youtube_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting API Keys

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy the Project URL and anon public key
5. Copy the service_role key (keep this secret!)

#### OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

#### ExerciseDB API (Optional)
1. Go to [exercisedb.com](https://exercisedb.com)
2. Sign up for an account
3. Get your API key from the dashboard

#### YouTube API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

---

## 🗄️ Database Setup

### Automatic Setup (Recommended)
```bash
# This will create all tables, indexes, and seed data
npm run db:init
```

### Manual Setup

#### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

#### 2. Run Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `lib/database/schema.sql`
3. Paste and run the SQL script

#### 3. Seed Initial Data
1. Copy the contents of `lib/database/seed-data.sql`
2. Paste and run the SQL script

### Database Structure

The database includes 9 core tables:
- **users**: User profiles and authentication
- **sessions**: Training session data
- **session_exercises**: Exercises within sessions
- **set_logs**: Individual set records
- **daily_check_ins**: Wellness and mood data
- **progress_metrics**: Performance tracking
- **exercises**: Exercise library
- **programs**: Training program templates
- **program_exercises**: Exercise assignments

---

## 🔌 API Configuration

### Testing API Endpoints

```bash
# Test all API endpoints
npm run test:api
```

### Available API Endpoints

#### Session Management
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/[id]` - Get specific session
- `PUT /api/sessions/[id]` - Update session
- `DELETE /api/sessions/[id]` - Delete session

#### Check-ins
- `GET /api/check-ins` - List check-ins
- `POST /api/check-ins` - Create check-in

#### Exercises
- `GET /api/exercises` - List exercises
- `POST /api/exercises` - Create custom exercise
- `GET /api/exercises/sync` - Sync external exercises
- `GET /api/exercises/videos` - Search exercise videos

#### AI & Adaptation
- `POST /api/ai/adaptation` - Get AI recommendations
- `POST /api/safety/monitor` - Safety monitoring

#### Program Management
- `GET /api/program` - Get training program
- `POST /api/program` - Generate new program

---

## 💻 Development Setup

### Project Structure
```
teen-training-pwa/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── exercises/         # Exercise pages
│   ├── profile/           # User profile
│   ├── progress/          # Progress tracking
│   └── session/           # Training sessions
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                  # Utility libraries
│   ├── api/              # External API integrations
│   ├── database/         # Database schema and seeds
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
├── public/               # Static assets
│   ├── sw.js            # Service worker
│   └── manifest.json    # PWA manifest
└── scripts/             # Build and setup scripts
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Database operations
npm run db:init    # Initialize database
npm run db:seed    # Seed with sample data
npm run test:api   # Test API endpoints
```

### Code Organization

#### Frontend Components
- **UI Components**: Reusable UI elements in `components/ui/`
- **Feature Components**: Business logic components in `components/`
- **Pages**: Next.js pages in `app/` directory

#### Backend Services
- **API Routes**: Next.js API routes in `app/api/`
- **Database**: Schema and utilities in `lib/database/`
- **External APIs**: Integration services in `lib/api/`
- **Business Logic**: Core algorithms in `lib/utils/`

---

## 🚀 Production Deployment

### Vercel Deployment (Recommended)

#### 1. Connect to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

#### 2. Configure Environment Variables
In your Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add all required environment variables
4. Redeploy the project

#### 3. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings

### Other Deployment Options

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Production Checklist

- [ ] Environment variables configured
- [ ] Database initialized and seeded
- [ ] API endpoints tested
- [ ] PWA manifest configured
- [ ] Service worker registered
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Monitoring set up

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check Supabase connection
npm run test:api

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### API Key Issues
- Verify API keys are correct
- Check API key permissions
- Ensure keys are in `.env.local` file

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### PWA Issues
- Check service worker registration
- Verify manifest.json configuration
- Test offline functionality

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check specific modules
DEBUG=teen-training:* npm run dev
```

### Logs and Monitoring

#### Development Logs
```bash
# View development logs
npm run dev 2>&1 | tee dev.log

# Check API logs
tail -f dev.log | grep "API"
```

#### Production Monitoring
- Vercel Analytics (if using Vercel)
- Supabase Dashboard for database metrics
- OpenAI usage dashboard for API costs

---

## 📞 Support

### Documentation
- **MVP Readiness**: `MVP_READINESS.md`
- **Database Setup**: `DATABASE_SETUP.md`
- **Backend Setup**: `BACKEND_SETUP.md`
- **Design Principles**: `DESIGN_PRINCIPLES.md`

### Getting Help
1. Check the troubleshooting section above
2. Review the documentation files
3. Check GitHub issues
4. Contact the development team

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 🎉 Next Steps

After successful setup:

1. **Test the Application**
   - Complete a full training session
   - Test offline functionality
   - Verify data persistence

2. **Customize for Your Needs**
   - Modify exercise library
   - Adjust training program
   - Customize UI components

3. **Deploy to Production**
   - Set up production environment
   - Configure monitoring
   - Launch to users

4. **Monitor and Maintain**
   - Track usage analytics
   - Monitor performance
   - Regular updates

---

*Last Updated: December 2024*
*Version: 1.0.0*
*Status: Production Ready*
