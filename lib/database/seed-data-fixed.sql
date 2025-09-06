-- Seed data for Teen Training PWA
-- This file contains initial data to populate the database

-- Insert sample exercises
INSERT INTO exercises (name, description, category, muscle_groups, equipment, difficulty_level, instructions, video_url, image_url, is_custom) VALUES
-- Lower Body Exercises
('Bodyweight Squat', 'Basic squat movement using only body weight', 'Lower Body', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['none'], 'beginner', ARRAY['Stand with feet shoulder-width apart', 'Lower down as if sitting in a chair', 'Keep chest up and knees behind toes', 'Return to starting position'], 'https://youtube.com/watch?v=example1', '/images/squat.jpg', false),

('Goblet Squat', 'Squat holding a weight at chest level', 'Lower Body', ARRAY['quadriceps', 'glutes', 'hamstrings', 'core'], ARRAY['dumbbell', 'kettlebell'], 'intermediate', ARRAY['Hold weight at chest level', 'Stand with feet shoulder-width apart', 'Lower down keeping weight close to body', 'Drive through heels to stand up'], 'https://youtube.com/watch?v=example2', '/images/goblet-squat.jpg', false),

('Jump Squat', 'Explosive squat with vertical jump', 'Plyometric', ARRAY['quadriceps', 'glutes', 'calves'], ARRAY['none'], 'intermediate', ARRAY['Start in squat position', 'Explode upward into a jump', 'Land softly in squat position', 'Immediately prepare for next rep'], 'https://youtube.com/watch?v=example3', '/images/jump-squat.jpg', false),

('Lateral Bounds', 'Side-to-side jumping movement', 'Plyometric', ARRAY['glutes', 'hip_abductors', 'calves'], ARRAY['none'], 'intermediate', ARRAY['Start in athletic stance', 'Jump laterally to one side', 'Land on one foot', 'Immediately bound to other side'], 'https://youtube.com/watch?v=example4', '/images/lateral-bounds.jpg', false),

-- Upper Body Exercises
('Push-up', 'Classic upper body pushing exercise', 'Upper Body', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['none'], 'beginner', ARRAY['Start in plank position', 'Lower chest to ground', 'Keep body straight', 'Push back up to starting position'], 'https://youtube.com/watch?v=example5', '/images/push-up.jpg', false),

('Dumbbell Row', 'Pulling exercise for back muscles', 'Upper Body', ARRAY['lats', 'rhomboids', 'biceps'], ARRAY['dumbbell', 'bench'], 'intermediate', ARRAY['Bend over with dumbbell in hand', 'Pull weight to hip', 'Squeeze shoulder blades together', 'Lower with control'], 'https://youtube.com/watch?v=example6', '/images/dumbbell-row.jpg', false),

('Pull-up', 'Bodyweight pulling exercise', 'Upper Body', ARRAY['lats', 'biceps', 'rhomboids'], ARRAY['pull_up_bar'], 'advanced', ARRAY['Hang from bar with overhand grip', 'Pull body up until chin over bar', 'Lower with control', 'Keep core engaged throughout'], 'https://youtube.com/watch?v=example7', '/images/pull-up.jpg', false),

-- Core Exercises
('Plank', 'Isometric core strengthening exercise', 'Core', ARRAY['core', 'shoulders'], ARRAY['none'], 'beginner', ARRAY['Start in push-up position', 'Hold body straight', 'Engage core muscles', 'Breathe normally'], 'https://youtube.com/watch?v=example8', '/images/plank.jpg', false),

('Mountain Climbers', 'Dynamic core and cardio exercise', 'Core', ARRAY['core', 'shoulders', 'legs'], ARRAY['none'], 'intermediate', ARRAY['Start in plank position', 'Bring one knee to chest', 'Quickly switch legs', 'Maintain plank position'], 'https://youtube.com/watch?v=example9', '/images/mountain-climbers.jpg', false),

-- Sport-Specific Exercises
('Volleyball Serve Practice', 'Practice serving technique', 'Sport Specific', ARRAY['shoulders', 'core', 'legs'], ARRAY['volleyball'], 'intermediate', ARRAY['Stand with feet shoulder-width apart', 'Hold ball in non-dominant hand', 'Toss ball up and forward', 'Strike ball with open hand'], 'https://youtube.com/watch?v=example10', '/images/volleyball-serve.jpg', false),

('Broad Jump', 'Horizontal jumping for power development', 'Plyometric', ARRAY['quadriceps', 'glutes', 'calves'], ARRAY['none'], 'intermediate', ARRAY['Stand with feet shoulder-width apart', 'Swing arms back', 'Jump forward as far as possible', 'Land with both feet simultaneously'], 'https://youtube.com/watch?v=example11', '/images/broad-jump.jpg', false),

('10-Yard Sprint', 'Short distance speed training', 'Speed', ARRAY['quadriceps', 'calves', 'glutes'], ARRAY['none'], 'beginner', ARRAY['Start in athletic stance', 'Sprint 10 yards as fast as possible', 'Focus on quick turnover', 'Decelerate gradually'], 'https://youtube.com/watch?v=example12', '/images/sprint.jpg', false);

-- Insert sample users (for testing)
INSERT INTO users (id, email, full_name, age, sport, experience_level, profile_data) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', 16, 'Volleyball', 'intermediate', '{"height": 170, "weight": 65, "goals": ["improve vertical jump", "increase serve power"], "preferences": {"workout_duration": 45, "preferred_times": ["morning"], "equipment_available": ["dumbbells", "resistance_bands"]}}'),
('550e8400-e29b-41d4-a716-446655440001', 'demo@example.com', 'Demo Athlete', 17, 'Basketball', 'beginner', '{"height": 175, "weight": 70, "goals": ["build strength", "improve agility"], "preferences": {"workout_duration": 30, "preferred_times": ["afternoon"], "equipment_available": ["none"]}}');

-- Insert sample daily check-ins
INSERT INTO daily_check_ins (user_id, date, mood, energy_level, sleep_hours, muscle_soreness, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '2024-01-01', 4, 7, 8.5, 2, 'Feeling good, ready to start the program'),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-02', 5, 8, 7.5, 3, 'Great energy today, slight soreness from yesterday'),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-03', 3, 6, 6.5, 4, 'Tired today, need more sleep'),
('550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 4, 6, 8.0, 2, 'First day, excited to begin'),
('550e8400-e29b-41d4-a716-446655440001', '2024-01-02', 5, 7, 7.0, 3, 'Good session yesterday');

-- Insert sample sessions for week 1
INSERT INTO sessions (user_id, date, session_type, week_number, day_number, status, duration_minutes, total_sets, total_reps, average_rpe, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '2024-01-01', 'am', 1, 1, 'completed', 45, 12, 60, 6.5, 'Great first session, felt strong'),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-02', 'am', 1, 2, 'completed', 40, 10, 50, 7.0, 'Good upper body work'),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-03', 'am', 1, 3, 'completed', 35, 8, 40, 6.0, 'Endurance session, felt good'),
('550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 'am', 1, 1, 'completed', 30, 8, 40, 5.5, 'Beginner-friendly session');

-- Insert sample session exercises
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, weight, rest_seconds, notes) VALUES
-- Session 1 (Lower body)
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-01' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Bodyweight Squat'), 1, 3, 12, NULL, 60, 'Focus on form'),
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-01' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Goblet Squat'), 2, 3, 10, 15.0, 90, 'Good weight progression'),
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-01' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Jump Squat'), 3, 3, 8, NULL, 120, 'Explosive movement'),
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-01' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Plank'), 4, 3, 30, NULL, 60, 'Hold for 30 seconds'),

-- Session 2 (Upper body)
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-02' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Push-up'), 1, 3, 10, NULL, 60, 'Modified if needed'),
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-02' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Dumbbell Row'), 2, 3, 12, 20.0, 90, 'Good form maintained'),
((SELECT id FROM sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND date = '2024-01-02' AND session_type = 'am'), (SELECT id FROM exercises WHERE name = 'Mountain Climbers'), 3, 3, 20, NULL, 60, 'Quick pace');

-- Insert sample set logs
INSERT INTO set_logs (session_exercise_id, set_number, reps_completed, weight_used, rpe, rest_taken_seconds, notes) VALUES
-- Goblet Squat sets
((SELECT se.id FROM session_exercises se JOIN sessions s ON se.session_id = s.id WHERE s.user_id = '550e8400-e29b-41d4-a716-446655440000' AND s.date = '2024-01-01' AND se.order_index = 2), 1, 10, 15.0, 6, 90, 'Good form'),
((SELECT se.id FROM session_exercises se JOIN sessions s ON se.session_id = s.id WHERE s.user_id = '550e8400-e29b-41d4-a716-446655440000' AND s.date = '2024-01-01' AND se.order_index = 2), 2, 10, 15.0, 7, 90, 'Felt heavier'),
((SELECT se.id FROM session_exercises se JOIN sessions s ON se.session_id = s.id WHERE s.user_id = '550e8400-e29b-41d4-a716-446655440000' AND s.date = '2024-01-01' AND se.order_index = 2), 3, 8, 15.0, 8, 90, 'Last set was tough'),

-- Push-up sets
((SELECT se.id FROM session_exercises se JOIN sessions s ON se.session_id = s.id WHERE s.user_id = '550e8400-e29b-41d4-a716-446655440000' AND s.date = '2024-01-02' AND se.order_index = 1), 1, 10, NULL, 5, 60, 'Easy'),
((SELECT se.id FROM session_exercises se JOIN sessions s ON se.session_id = s.id WHERE s.user_id = '550e8400-e29b-41d4-a716-446655440000' AND s.date = '2024-01-02' AND se.order_index = 1), 2, 8, NULL, 7, 60, 'Getting harder'),
((SELECT se.id FROM session_exercises se JOIN sessions s ON se.session_id = s.id WHERE s.user_id = '550e8400-e29b-41d4-a716-446655440000' AND s.date = '2024-01-02' AND se.order_index = 1), 3, 6, NULL, 8, 60, 'Last few were tough');

-- Insert sample progress metrics
INSERT INTO progress_metrics (user_id, metric_type, value, unit, date, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'broad_jump', 2.1, 'meters', '2024-01-01', 'Initial measurement'),
('550e8400-e29b-41d4-a716-446655440000', 'vertical_reach', 2.8, 'meters', '2024-01-01', 'Baseline test'),
('550e8400-e29b-41d4-a716-446655440000', 'sprint_10yd', 1.8, 'seconds', '2024-01-01', 'First sprint test'),
('550e8400-e29b-41d4-a716-446655440000', 'serve_accuracy', 75.0, 'percent', '2024-01-01', 'Volleyball serve practice'),
('550e8400-e29b-41d4-a716-446655440000', 'passing_quality', 2.5, 'scale', '2024-01-01', '0-3 scale rating');

-- Insert sample achievements
INSERT INTO achievements (user_id, achievement_type, title, description, unlocked_at, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'streak', 'First Week Complete', 'Completed your first week of training!', '2024-01-07', '{"week": 1}'),
('550e8400-e29b-41d4-a716-446655440000', 'consistency', 'Perfect Attendance', 'Completed all scheduled sessions this week', '2024-01-07', '{"sessions_completed": 6}'),
('550e8400-e29b-41d4-a716-446655440000', 'progress', 'Strength Builder', 'Increased weight on an exercise', '2024-01-03', '{"exercise": "Goblet Squat", "weight_increase": 2.5}');

-- Insert sample safety alerts
INSERT INTO safety_alerts (user_id, alert_type, severity, message, is_resolved, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'fatigue', 'medium', 'Elevated fatigue levels detected. Consider taking additional rest.', false, '2024-01-03 10:00:00'),
('550e8400-e29b-41d4-a716-446655440000', 'form', 'low', 'Focus on maintaining proper form during squats.', false, '2024-01-02 15:30:00');
