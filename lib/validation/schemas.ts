import { z } from 'zod';

// Session validation schema
export const sessionSchema = z.object({
  id: z.string().uuid('Invalid session ID format'),
  user_id: z.string().uuid('Invalid user ID format'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: z.enum(['strength', 'volleyball', 'conditioning'], {
    errorMap: () => ({
      message: 'Session type must be strength, volleyball, or conditioning',
    }),
  }),
  exercises: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, 'Exercise name is required')
          .max(100, 'Exercise name too long'),
        sets: z
          .array(
            z.object({
              reps: z
                .number()
                .int('Reps must be a whole number')
                .min(1, 'Reps must be at least 1')
                .max(1000, 'Reps too high'),
              weight: z
                .number()
                .min(0, 'Weight cannot be negative')
                .max(10000, 'Weight too high')
                .optional(),
              rpe: z
                .number()
                .min(1, 'RPE must be at least 1')
                .max(10, 'RPE must be at most 10'),
              completed: z.boolean(),
            })
          )
          .min(1, 'At least one set is required')
          .max(50, 'Too many sets'),
      })
    )
    .min(1, 'At least one exercise is required')
    .max(20, 'Too many exercises'),
  totalRPE: z
    .number()
    .min(1, 'Total RPE must be at least 1')
    .max(100, 'Total RPE too high'),
  duration: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration too long (max 24 hours)'),
  completed: z.boolean(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Check-in validation schema
export const checkInSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid('Invalid user ID format'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  mood: z
    .number()
    .int('Mood must be a whole number')
    .min(1, 'Mood must be at least 1')
    .max(10, 'Mood must be at most 10'),
  energy: z
    .number()
    .int('Energy must be a whole number')
    .min(1, 'Energy must be at least 1')
    .max(10, 'Energy must be at most 10'),
  sleep: z
    .number()
    .min(0, 'Sleep cannot be negative')
    .max(24, 'Sleep cannot exceed 24 hours'),
  soreness: z
    .number()
    .int('Soreness must be a whole number')
    .min(1, 'Soreness must be at least 1')
    .max(10, 'Soreness must be at most 10'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Progress metrics validation schema
export const progressMetricsSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid('Invalid user ID format'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  metric_type: z.enum(
    ['strength', 'endurance', 'flexibility', 'coordination'],
    {
      errorMap: () => ({
        message:
          'Metric type must be strength, endurance, flexibility, or coordination',
      }),
    }
  ),
  value: z
    .number()
    .min(0, 'Value cannot be negative')
    .max(1000000, 'Value too high'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit too long'),
  notes: z.string().max(500, 'Notes too long').optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Achievement validation schema
export const achievementSchema = z
  .object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid('Invalid user ID format'),
    achievement_type: z
      .string()
      .min(1, 'Achievement type is required')
      .max(50, 'Achievement type too long'),
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description too long'),
    icon: z.string().min(1, 'Icon is required').max(10, 'Icon too long'),
    unlocked_at: z.string().datetime('Invalid date format'),
    progress: z
      .number()
      .int('Progress must be a whole number')
      .min(0, 'Progress cannot be negative'),
    max_progress: z
      .number()
      .int('Max progress must be a whole number')
      .min(1, 'Max progress must be at least 1'),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  })
  .refine(data => data.progress <= data.max_progress, {
    message: 'Progress cannot exceed max progress',
    path: ['progress'],
  });

// Notification validation schema
export const notificationSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid('Invalid user ID format'),
  type: z.enum(['achievement', 'reminder', 'progress', 'system'], {
    errorMap: () => ({
      message: 'Type must be achievement, reminder, progress, or system',
    }),
  }),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message too long'),
  read: z.boolean(),
  data: z.record(z.any()).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// User validation schema
export const userSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  current_week: z
    .number()
    .int('Week must be a whole number')
    .min(1, 'Week must be at least 1')
    .max(52, 'Week must be at most 52')
    .optional(),
  sport: z
    .string()
    .min(1, 'Sport is required')
    .max(50, 'Sport name too long')
    .optional(),
  experience_level: z
    .enum(['beginner', 'intermediate', 'advanced'], {
      errorMap: () => ({
        message: 'Experience level must be beginner, intermediate, or advanced',
      }),
    })
    .optional(),
  goals: z.array(z.string()).max(10, 'Too many goals').optional(),
  equipment: z.array(z.string()).max(20, 'Too many equipment items').optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// Form validation schemas (without user_id for creation)
export const createSessionSchema = sessionSchema.omit({ user_id: true });
export const createCheckInSchema = checkInSchema.omit({ user_id: true });
export const createProgressMetricsSchema = progressMetricsSchema.omit({
  user_id: true,
});
export const createAchievementSchema = achievementSchema.omit({
  user_id: true,
});
export const createNotificationSchema = notificationSchema.omit({
  user_id: true,
});

// Validation helper functions
export function validateSession(data: unknown) {
  return sessionSchema.safeParse(data);
}

export function validateCheckIn(data: unknown) {
  return checkInSchema.safeParse(data);
}

export function validateProgressMetrics(data: unknown) {
  return progressMetricsSchema.safeParse(data);
}

export function validateAchievement(data: unknown) {
  return achievementSchema.safeParse(data);
}

export function validateNotification(data: unknown) {
  return notificationSchema.safeParse(data);
}

export function validateUser(data: unknown) {
  return userSchema.safeParse(data);
}

// Validation error formatter
export function formatValidationError(error: z.ZodError): string {
  return error.errors
    .map(err => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
}

// Type exports for TypeScript
export type SessionInput = z.infer<typeof createSessionSchema>;
export type CheckInInput = z.infer<typeof createCheckInSchema>;
export type ProgressMetricsInput = z.infer<typeof createProgressMetricsSchema>;
export type AchievementInput = z.infer<typeof createAchievementSchema>;
export type NotificationInput = z.infer<typeof createNotificationSchema>;
export type UserInput = z.infer<typeof userSchema>;
