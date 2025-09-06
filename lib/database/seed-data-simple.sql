-- Simplified seed data for Teen Training PWA
-- Run this AFTER running schema.sql

-- Insert sample exercises (simplified)
INSERT INTO exercises (name, description, category, muscle_groups, equipment, difficulty_level, instructions, is_custom) VALUES
('Bodyweight Squat', 'Basic squat movement using only body weight', 'Lower Body', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['none'], 'beginner', ARRAY['Stand with feet shoulder-width apart', 'Lower down as if sitting in a chair', 'Keep chest up and knees behind toes', 'Return to starting position'], false),
('Push-up', 'Classic upper body pushing exercise', 'Upper Body', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['none'], 'beginner', ARRAY['Start in plank position', 'Lower chest to ground', 'Keep body straight', 'Push back up to starting position'], false),
('Plank', 'Isometric core strengthening exercise', 'Core', ARRAY['core', 'shoulders'], ARRAY['none'], 'beginner', ARRAY['Start in push-up position', 'Hold body straight', 'Engage core muscles', 'Breathe normally'], false);

-- Insert sample users (simplified)
INSERT INTO users (id, email, full_name, age, sport, experience_level) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', 16, 'Volleyball', 'intermediate'),
('550e8400-e29b-41d4-a716-446655440001', 'demo@example.com', 'Demo Athlete', 17, 'Basketball', 'beginner');

-- Insert sample daily check-ins
INSERT INTO daily_check_ins (user_id, date, mood, energy_level, sleep_hours, muscle_soreness, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '2024-01-01', 4, 7, 8.5, 2, 'Feeling good, ready to start the program'),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-02', 5, 8, 7.5, 3, 'Great energy today, slight soreness from yesterday');

-- Insert sample sessions
INSERT INTO sessions (user_id, date, session_type, week_number, day_number, status, duration_minutes, total_sets, total_reps, average_rpe, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '2024-01-01', 'am', 1, 1, 'completed', 45, 12, 60, 6.5, 'Great first session, felt strong'),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-02', 'am', 1, 2, 'completed', 40, 10, 50, 7.0, 'Good upper body work');
