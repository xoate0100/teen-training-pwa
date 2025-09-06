# Teen Training PWA - API Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Examples](#examples)

---

## 🎯 Overview

The Teen Training PWA API provides a comprehensive set of endpoints for managing training sessions, user data, exercises, and AI-powered features. All endpoints are built with Next.js API routes and use Supabase for data persistence.

### Key Features

- **RESTful API Design**: Standard HTTP methods and status codes
- **TypeScript Support**: Full type safety across all endpoints
- **Real-time Updates**: Supabase real-time subscriptions
- **AI Integration**: OpenAI-powered adaptation and recommendations
- **Safety Monitoring**: Real-time risk assessment and alerts
- **Offline Support**: Background sync and data persistence

---

## 🔐 Authentication

### Supabase Authentication

All API endpoints use Supabase for authentication. Include the user's JWT token in the Authorization header:

```http
Authorization: Bearer <user_jwt_token>
```

### Getting User Token

```javascript
// Client-side
const {
  data: { session },
} = await supabase.auth.getSession();
const token = session?.access_token;

// Use in API calls
fetch('/api/sessions', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🌐 Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔌 Endpoints

### Session Management

#### GET /api/sessions

Get all training sessions for the authenticated user.

**Query Parameters:**

- `limit` (optional): Number of sessions to return (default: 10)
- `offset` (optional): Number of sessions to skip (default: 0)
- `status` (optional): Filter by session status (`completed`, `in_progress`, `scheduled`)

**Response:**

```json
{
  "sessions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "program_id": "uuid",
      "week": 1,
      "day": "monday",
      "session_type": "strength",
      "status": "completed",
      "started_at": "2024-01-01T10:00:00Z",
      "completed_at": "2024-01-01T11:00:00Z",
      "total_duration": 3600,
      "exercises": [...]
    }
  ],
  "total": 25,
  "has_more": true
}
```

#### POST /api/sessions

Create a new training session.

**Request Body:**

```json
{
  "program_id": "uuid",
  "week": 1,
  "day": "monday",
  "session_type": "strength",
  "exercises": [
    {
      "exercise_id": "uuid",
      "sets": 3,
      "reps": 10,
      "weight": 50,
      "rest_seconds": 90
    }
  ]
}
```

**Response:**

```json
{
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "program_id": "uuid",
    "week": 1,
    "day": "monday",
    "session_type": "strength",
    "status": "scheduled",
    "created_at": "2024-01-01T10:00:00Z",
    "exercises": [...]
  }
}
```

#### GET /api/sessions/[id]

Get a specific training session by ID.

**Response:**

```json
{
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "program_id": "uuid",
    "week": 1,
    "day": "monday",
    "session_type": "strength",
    "status": "completed",
    "started_at": "2024-01-01T10:00:00Z",
    "completed_at": "2024-01-01T11:00:00Z",
    "total_duration": 3600,
    "exercises": [
      {
        "id": "uuid",
        "exercise_id": "uuid",
        "exercise_name": "Push-ups",
        "sets": 3,
        "reps": 10,
        "weight": 0,
        "rest_seconds": 90,
        "sets_logged": [
          {
            "set_number": 1,
            "reps": 10,
            "weight": 0,
            "rpe": 7,
            "notes": "Felt good"
          }
        ]
      }
    ]
  }
}
```

#### PUT /api/sessions/[id]

Update a training session.

**Request Body:**

```json
{
  "status": "completed",
  "completed_at": "2024-01-01T11:00:00Z",
  "total_duration": 3600
}
```

#### DELETE /api/sessions/[id]

Delete a training session.

**Response:**

```json
{
  "message": "Session deleted successfully"
}
```

### Check-ins

#### GET /api/check-ins

Get daily check-ins for the authenticated user.

**Query Parameters:**

- `limit` (optional): Number of check-ins to return (default: 30)
- `offset` (optional): Number of check-ins to skip (default: 0)
- `start_date` (optional): Start date filter (ISO 8601)
- `end_date` (optional): End date filter (ISO 8601)

**Response:**

```json
{
  "check_ins": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "date": "2024-01-01",
      "mood": "happy",
      "energy_level": 8,
      "sleep_hours": 8.5,
      "muscle_soreness": 3,
      "stress_level": 4,
      "hydration_level": 7,
      "notes": "Feeling great today!",
      "created_at": "2024-01-01T08:00:00Z"
    }
  ],
  "total": 30
}
```

#### POST /api/check-ins

Create a new daily check-in.

**Request Body:**

```json
{
  "date": "2024-01-01",
  "mood": "happy",
  "energy_level": 8,
  "sleep_hours": 8.5,
  "muscle_soreness": 3,
  "stress_level": 4,
  "hydration_level": 7,
  "notes": "Feeling great today!"
}
```

**Response:**

```json
{
  "check_in": {
    "id": "uuid",
    "user_id": "uuid",
    "date": "2024-01-01",
    "mood": "happy",
    "energy_level": 8,
    "sleep_hours": 8.5,
    "muscle_soreness": 3,
    "stress_level": 4,
    "hydration_level": 7,
    "notes": "Feeling great today!",
    "created_at": "2024-01-01T08:00:00Z"
  }
}
```

### Exercises

#### GET /api/exercises

Get the exercise library with filtering and pagination.

**Query Parameters:**

- `limit` (optional): Number of exercises to return (default: 20)
- `offset` (optional): Number of exercises to skip (default: 0)
- `category` (optional): Filter by exercise category
- `muscle_group` (optional): Filter by muscle group
- `equipment` (optional): Filter by required equipment
- `difficulty` (optional): Filter by difficulty level
- `search` (optional): Search by exercise name

**Response:**

```json
{
  "exercises": [
    {
      "id": "uuid",
      "name": "Push-ups",
      "category": "strength",
      "muscle_groups": ["chest", "shoulders", "triceps"],
      "equipment": "bodyweight",
      "difficulty": "beginner",
      "instructions": "Start in plank position...",
      "video_url": "https://youtube.com/watch?v=...",
      "image_url": "https://example.com/pushup.jpg"
    }
  ],
  "total": 150,
  "has_more": true
}
```

#### POST /api/exercises

Create a custom exercise.

**Request Body:**

```json
{
  "name": "Custom Exercise",
  "category": "strength",
  "muscle_groups": ["chest"],
  "equipment": "dumbbells",
  "difficulty": "intermediate",
  "instructions": "Custom exercise instructions...",
  "video_url": "https://youtube.com/watch?v=...",
  "image_url": "https://example.com/image.jpg"
}
```

#### GET /api/exercises/sync

Sync exercises from external sources (ExerciseDB).

**Response:**

```json
{
  "message": "Exercises synced successfully",
  "synced_count": 150,
  "total_exercises": 5000
}
```

#### GET /api/exercises/videos

Search for exercise demonstration videos.

**Query Parameters:**

- `exercise_name` (required): Name of the exercise to search for
- `limit` (optional): Number of videos to return (default: 5)

**Response:**

```json
{
  "videos": [
    {
      "video_id": "abc123",
      "title": "How to do Push-ups",
      "description": "Proper push-up form tutorial",
      "thumbnail_url": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
      "duration": "PT5M30S",
      "channel_title": "Fitness Channel"
    }
  ]
}
```

### AI & Adaptation

#### POST /api/ai/adaptation

Get AI-powered training recommendations based on user data.

**Request Body:**

```json
{
  "user_id": "uuid",
  "session_id": "uuid",
  "wellness_data": {
    "mood": "happy",
    "energy_level": 8,
    "sleep_hours": 8.5,
    "muscle_soreness": 3,
    "stress_level": 4
  },
  "performance_data": {
    "recent_rpe": [7, 8, 6],
    "completion_rate": 0.95,
    "injury_risk": "low"
  }
}
```

**Response:**

```json
{
  "recommendations": {
    "intensity_adjustment": "increase",
    "rest_time": 120,
    "exercise_substitutions": [
      {
        "original_exercise": "Push-ups",
        "substitute": "Incline Push-ups",
        "reason": "Reduce intensity due to shoulder fatigue"
      }
    ],
    "motivational_message": "Great job on your consistency! You're making excellent progress.",
    "form_cues": [
      "Keep your core tight",
      "Maintain straight line from head to heels"
    ],
    "safety_alerts": []
  }
}
```

### Safety Monitoring

#### POST /api/safety/monitor

Get real-time safety assessment and alerts.

**Request Body:**

```json
{
  "user_id": "uuid",
  "session_data": {
    "current_exercise": "Squats",
    "sets_completed": 2,
    "total_sets": 3,
    "current_rpe": 8,
    "form_quality": "good",
    "fatigue_level": "moderate"
  },
  "wellness_data": {
    "energy_level": 6,
    "muscle_soreness": 4,
    "sleep_hours": 7
  }
}
```

**Response:**

```json
{
  "safety_assessment": {
    "risk_level": "low",
    "alerts": [],
    "recommendations": [
      "Consider reducing weight by 5%",
      "Take an extra 30 seconds rest"
    ],
    "form_feedback": "Maintain good form throughout the movement"
  }
}
```

### Program Management

#### GET /api/program

Get the user's training program.

**Query Parameters:**

- `week` (optional): Specific week to retrieve (default: current week)

**Response:**

```json
{
  "program": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "11-Week Athletic Development",
    "current_week": 3,
    "total_weeks": 11,
    "phase": "strength",
    "weekly_schedule": {
      "monday": {
        "am": "strength",
        "pm": "skills"
      },
      "tuesday": {
        "am": "upper_body",
        "pm": "conditioning"
      }
    },
    "exercises": [...]
  }
}
```

#### POST /api/program

Generate a new training program for the user.

**Request Body:**

```json
{
  "user_id": "uuid",
  "goals": ["strength", "endurance"],
  "experience_level": "intermediate",
  "available_equipment": ["dumbbells", "resistance_bands"],
  "time_commitment": "45_minutes"
}
```

---

## 📊 Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  age: number;
  sport: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  created_at: string;
  updated_at: string;
}
```

### Session

```typescript
interface Session {
  id: string;
  user_id: string;
  program_id: string;
  week: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  session_type: 'strength' | 'endurance' | 'skills' | 'conditioning';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  total_duration?: number;
  created_at: string;
  updated_at: string;
}
```

### Exercise

```typescript
interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports_specific';
  muscle_groups: string[];
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}
```

### Check-in

```typescript
interface CheckIn {
  id: string;
  user_id: string;
  date: string;
  mood: 'tired' | 'okay' | 'good' | 'great' | 'amazing';
  energy_level: number; // 1-10
  sleep_hours: number;
  muscle_soreness: number; // 1-5
  stress_level: number; // 1-5
  hydration_level: number; // 1-10
  notes?: string;
  created_at: string;
}
```

---

## 💡 Examples

### Complete Training Session Flow

```javascript
// 1. Create a new session
const sessionResponse = await fetch('/api/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    program_id: 'program-uuid',
    week: 1,
    day: 'monday',
    session_type: 'strength',
    exercises: [
      {
        exercise_id: 'exercise-uuid',
        sets: 3,
        reps: 10,
        weight: 50,
        rest_seconds: 90,
      },
    ],
  }),
});

const { session } = await sessionResponse.json();

// 2. Log a set
const setResponse = await fetch(
  `/api/sessions/${session.id}/exercises/${exerciseId}/sets`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      set_number: 1,
      reps: 10,
      weight: 50,
      rpe: 7,
      notes: 'Felt good',
    }),
  }
);

// 3. Complete the session
const completeResponse = await fetch(`/api/sessions/${session.id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    status: 'completed',
    completed_at: new Date().toISOString(),
    total_duration: 3600,
  }),
});
```

### Daily Check-in Flow

```javascript
// Submit daily check-in
const checkInResponse = await fetch('/api/check-ins', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    date: '2024-01-01',
    mood: 'good',
    energy_level: 8,
    sleep_hours: 8.5,
    muscle_soreness: 3,
    stress_level: 4,
    hydration_level: 7,
    notes: 'Feeling great today!',
  }),
});

const { check_in } = await checkInResponse.json();
```

### AI Adaptation Request

```javascript
// Get AI recommendations
const aiResponse = await fetch('/api/ai/adaptation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    user_id: 'user-uuid',
    session_id: 'session-uuid',
    wellness_data: {
      mood: 'good',
      energy_level: 8,
      sleep_hours: 8.5,
      muscle_soreness: 3,
      stress_level: 4,
    },
    performance_data: {
      recent_rpe: [7, 8, 6],
      completion_rate: 0.95,
      injury_risk: 'low',
    },
  }),
});

const { recommendations } = await aiResponse.json();
```

---

## 🔧 Testing

### Test API Endpoints

```bash
# Run the test suite
npm run test:api

# Test specific endpoint
curl -X GET http://localhost:3000/api/sessions \
  -H "Authorization: Bearer your-token"
```

### Postman Collection

Import the provided Postman collection for easy API testing:

- [Download Collection](postman/Teen-Training-PWA.postman_collection.json)

---

_Last Updated: December 2024_
_API Version: 1.0.0_
