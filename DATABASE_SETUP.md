# Database Setup Guide - Teen Training PWA

## 🚀 Quick Start

### Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js** - Version 18 or higher
3. **Environment Variables** - Configured in `.env.local`

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `teen-training-pwa`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

### Step 3: Configure Environment Variables

Update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: External APIs
EXERCISEDB_API_KEY=your_exercisedb_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Initialize Database

Run the database initialization script:

```bash
npm run db:init
```

This will:

- ✅ Create all database tables
- ✅ Set up Row Level Security (RLS) policies
- ✅ Create performance indexes
- ✅ Insert sample data
- ✅ Verify database connection

### Step 5: Test API Endpoints

Start the development server and test the API:

```bash
# Terminal 1: Start the app
npm run dev

# Terminal 2: Test the API
npm run test:api
```

## 📊 Database Schema Overview

### Core Tables

| Table               | Purpose           | Key Features                                   |
| ------------------- | ----------------- | ---------------------------------------------- |
| `users`             | User profiles     | Age validation (13-19), profile data JSON      |
| `daily_check_ins`   | Wellness tracking | Mood, energy, sleep, soreness tracking         |
| `exercises`         | Exercise library  | Built-in + custom exercises, difficulty levels |
| `sessions`          | Workout sessions  | 11-week program, AM/PM sessions                |
| `session_exercises` | Session exercises | Order, sets, reps, weight, rest time           |
| `set_logs`          | Set completions   | RPE, weight, reps, individual set data         |
| `progress_metrics`  | Performance data  | Broad jump, sprint times, accuracy             |
| `achievements`      | Gamification      | Streaks, milestones, badges                    |
| `safety_alerts`     | Safety monitoring | Fatigue, form, load, injury risk alerts        |

### Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Data Validation**: Proper constraints and type checking
- **Automatic Timestamps**: Created/updated timestamps on all tables
- **Performance Indexes**: Optimized for common query patterns

## 🧪 Sample Data Included

The database comes pre-populated with:

### Exercises (12 total)

- **Lower Body**: Bodyweight Squat, Goblet Squat, Jump Squat, Lateral Bounds
- **Upper Body**: Push-up, Dumbbell Row, Pull-up
- **Core**: Plank, Mountain Climbers
- **Sport-Specific**: Volleyball Serve, Broad Jump, 10-Yard Sprint

### Sample Users

- **Test User**: 16-year-old volleyball player (intermediate)
- **Demo Athlete**: 17-year-old basketball player (beginner)

### Sample Data

- **Check-ins**: 5 days of wellness data
- **Sessions**: Week 1 training sessions
- **Set Logs**: Completed workout data with RPE
- **Progress Metrics**: Initial performance measurements
- **Achievements**: Sample badges and milestones
- **Safety Alerts**: Example monitoring alerts

## 🔧 Manual Database Setup (Alternative)

If you prefer to set up the database manually:

### 1. Run Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `lib/database/schema.sql`
4. Paste and execute the SQL

### 2. Add Sample Data

1. Copy the contents of `lib/database/seed-data.sql`
2. Paste and execute in the SQL Editor

## 🚨 Troubleshooting

### Common Issues

#### "Missing environment variables"

- Ensure `.env.local` file exists in project root
- Check that all required variables are set
- Restart the development server after changes

#### "Database connection failed"

- Verify Supabase project is active
- Check that API keys are correct
- Ensure project URL is properly formatted

#### "Permission denied" errors

- Verify service role key is used for admin operations
- Check RLS policies are properly configured
- Ensure user authentication is working

#### "Table doesn't exist" errors

- Run the schema setup again
- Check that all tables were created successfully
- Verify you're using the correct database

### Getting Help

1. **Check the logs**: Look at the console output for specific error messages
2. **Verify Supabase**: Ensure your project is active and accessible
3. **Test connection**: Use the Supabase dashboard to verify database access
4. **Check permissions**: Ensure RLS policies are correctly configured

## 📈 Next Steps

After successful database setup:

1. **Test the API**: Run `npm run test:api` to verify all endpoints
2. **Start development**: Run `npm run dev` to start the app
3. **Explore the data**: Use the Supabase dashboard to view your data
4. **Customize**: Modify the seed data or add your own exercises
5. **Deploy**: Set up production database when ready to deploy

## 🔒 Security Notes

- **Never commit** `.env.local` to version control
- **Use service role key** only for server-side operations
- **Regular backups** of your database are recommended
- **Monitor usage** through Supabase dashboard
- **Rotate keys** periodically for security

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Database setup complete!** 🎉 Your teen training PWA now has a fully functional backend with comprehensive data management, AI integration, and safety monitoring.
