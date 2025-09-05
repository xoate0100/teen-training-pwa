// Database type definitions for the teen training PWA

export interface User {
  id: string
  email: string
  full_name?: string
  age?: number
  sport?: string
  experience_level?: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
  profile_data?: {
    height?: number
    weight?: number
    goals?: string[]
    preferences?: {
      workout_duration?: number
      preferred_times?: string[]
      equipment_available?: string[]
    }
  }
}

export interface DailyCheckIn {
  id: string
  user_id: string
  date: string
  mood: number // 1-5 scale
  energy_level: number // 1-10 scale
  sleep_hours: number
  muscle_soreness: number // 1-5 scale
  notes?: string
  created_at: string
  updated_at: string
}

export interface Exercise {
  id: string
  name: string
  description: string
  category: string
  muscle_groups: string[]
  equipment: string[]
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  instructions: string[]
  video_url?: string
  image_url?: string
  is_custom: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  date: string
  session_type: 'am' | 'pm'
  week_number: number
  day_number: number
  status: 'planned' | 'in_progress' | 'completed' | 'skipped'
  duration_minutes?: number
  total_sets?: number
  total_reps?: number
  average_rpe?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface SessionExercise {
  id: string
  session_id: string
  exercise_id: string
  order_index: number
  sets: number
  reps: number
  weight?: number
  rest_seconds: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface SetLog {
  id: string
  session_exercise_id: string
  set_number: number
  reps_completed: number
  weight_used?: number
  rpe: number // Rate of Perceived Exertion 1-10
  rest_taken_seconds?: number
  notes?: string
  created_at: string
}

export interface ProgressMetric {
  id: string
  user_id: string
  metric_type: 'broad_jump' | 'vertical_reach' | 'sprint_10yd' | 'serve_accuracy' | 'passing_quality'
  value: number
  unit: string
  date: string
  notes?: string
  created_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description: string
  unlocked_at: string
  metadata?: Record<string, any>
}

export interface SafetyAlert {
  id: string
  user_id: string
  alert_type: 'fatigue' | 'form' | 'load' | 'injury_risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  is_resolved: boolean
  created_at: string
  resolved_at?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// Request types for API endpoints
export interface CreateSessionRequest {
  user_id: string
  date: string
  session_type: 'am' | 'pm'
  week_number: number
  day_number: number
}

export interface UpdateSessionRequest {
  status?: 'in_progress' | 'completed' | 'skipped'
  duration_minutes?: number
  notes?: string
}

export interface LogSetRequest {
  session_exercise_id: string
  set_number: number
  reps_completed: number
  weight_used?: number
  rpe: number
  rest_taken_seconds?: number
  notes?: string
}

export interface CreateCheckInRequest {
  user_id: string
  date: string
  mood: number
  energy_level: number
  sleep_hours: number
  muscle_soreness: number
  notes?: string
}
