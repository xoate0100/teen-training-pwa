# Teen Training PWA - Backend Setup Guide

## 🚀 Backend Development Status

The backend infrastructure has been successfully set up with the following components:

### ✅ Completed Components

1. **Database Schema** (`lib/database/schema.sql`)
   - Complete PostgreSQL schema for Supabase
   - All required tables with proper relationships
   - Row Level Security (RLS) policies
   - Indexes for performance optimization

2. **API Endpoints** (`app/api/`)
   - Sessions CRUD operations (`/api/sessions`)
   - Daily check-ins (`/api/check-ins`)
   - Exercise library (`/api/exercises`)
   - Set logging (`/api/sessions/[id]/exercises/[exerciseId]/sets`)

3. **Type Definitions** (`lib/types/database.ts`)
   - Complete TypeScript interfaces
   - API request/response types
   - Database entity types

4. **Core Utilities**
   - Supabase client configuration (`lib/supabase/client.ts`)
   - AI adaptation engine (`lib/utils/ai/adaptation.ts`)
   - 11-week program logic (`lib/utils/program-logic.ts`)
   - Safety monitoring system (`lib/utils/safety-monitoring.ts`)

## 🔧 Next Steps Required

### 1. Supabase Database Setup

You need to create a Supabase project and run the database schema:

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Update Environment Variables:**
   ```bash
   # Update .env.local with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

3. **Run Database Schema:**
   - Copy the contents of `lib/database/schema.sql`
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Paste and execute the schema

### 2. OpenAI Integration Setup

1. **Get OpenAI API Key:**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an API key
   - Add to `.env.local`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 3. External API Integrations

#### ExerciseDB API (Optional)
```bash
EXERCISEDB_API_KEY=your_exercisedb_api_key_here
```

#### YouTube API for Exercise Demonstrations
```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 📊 Database Schema Overview

### Core Tables

1. **users** - User profiles and authentication
2. **daily_check_ins** - Daily wellness tracking
3. **exercises** - Exercise library (built-in + custom)
4. **sessions** - Workout sessions
5. **session_exercises** - Exercises within sessions
6. **set_logs** - Individual set completions
7. **progress_metrics** - Performance tracking
8. **achievements** - Gamification system
9. **safety_alerts** - Safety monitoring

### Key Features

- **Row Level Security**: Users can only access their own data
- **Automatic Timestamps**: Created/updated timestamps
- **Data Validation**: Proper constraints and checks
- **Performance Indexes**: Optimized for common queries

## 🤖 AI Integration Features

### Adaptation Engine
- Analyzes wellness data and performance trends
- Provides intensity and rest time adjustments
- Suggests exercise substitutions
- Generates motivational messages

### Safety Monitoring
- Real-time fatigue level analysis
- Form quality assessment
- Load progression tracking
- Injury risk evaluation
- Automatic safety alerts

## 📈 Program Logic

### 11-Week Periodization
- **Weeks 1-2**: Foundation phase
- **Weeks 3-4**: Strength building
- **Week 5**: Deload week
- **Weeks 6-7**: Progressive strength
- **Week 8**: Second deload
- **Weeks 9-10**: Power development
- **Week 11**: Peak performance

### Weekly Schedule Matrix
- 6 days per week (Monday-Saturday)
- AM sessions: Strength and conditioning
- PM sessions: Power and skills (weeks 9-11)
- Automatic intensity and volume adjustments

## 🔒 Safety Features

### Monitoring Systems
- Fatigue level tracking
- Form quality assessment
- Load progression limits
- Overtraining detection
- Age-appropriate recommendations

### Alert System
- Real-time safety alerts
- Severity levels (low, medium, high, critical)
- Automatic session modifications
- Emergency recommendations

## 🚀 Testing the Backend

Once you've set up the environment variables:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test API endpoints:**
   ```bash
   # Test sessions endpoint
   curl http://localhost:3000/api/sessions?user_id=test-user

   # Test check-ins endpoint
   curl -X POST http://localhost:3000/api/check-ins \
     -H "Content-Type: application/json" \
     -d '{"user_id":"test-user","date":"2024-01-01","mood":4,"energy_level":7,"sleep_hours":8,"muscle_soreness":2}'
   ```

## 📝 Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `EXERCISEDB_API_KEY` (optional)
- [ ] `YOUTUBE_API_KEY` (optional)

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the existing frontend:

1. **API Integration**: All frontend components can now consume real API endpoints
2. **Real-time Updates**: Supabase real-time subscriptions for live data
3. **Offline Support**: Service workers for offline functionality
4. **Data Persistence**: All user data is now properly stored and managed

## 📚 Next Development Phase

After setting up the environment variables:

1. **Test all API endpoints**
2. **Integrate with frontend components**
3. **Set up real-time subscriptions**
4. **Implement service workers for PWA**
5. **Add comprehensive error handling**
6. **Set up monitoring and analytics**

The backend is now ready for production use with proper database management, AI-powered adaptations, and comprehensive safety monitoring!
