import { http, HttpResponse } from 'msw';

export const handlers = [
  // API Routes
  http.get('/api/exercises', () => {
    return HttpResponse.json({
      exercises: [
        {
          id: 1,
          name: 'Push-ups',
          category: 'strength',
          difficulty: 'beginner',
          instructions: 'Start in plank position...',
        },
      ],
    });
  }),

  http.get('/api/sessions', () => {
    return HttpResponse.json({
      sessions: [
        {
          id: 1,
          name: 'Morning Workout',
          exercises: [],
          completed: false,
        },
      ],
    });
  }),

  http.get('/api/check-ins', () => {
    return HttpResponse.json({
      checkIns: [
        {
          id: 1,
          date: '2024-01-01',
          mood: 'great',
          energy: 8,
          notes: 'Feeling strong today!',
        },
      ],
    });
  }),

  // Supabase Auth
  http.post('https://your-project.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    });
  }),

  // OpenAI API
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [
        {
          message: {
            content: 'Mock AI response for testing',
          },
        },
      ],
    });
  }),

  // Error handlers
  http.get('/api/error', () => {
    return HttpResponse.json({ error: 'Test error' }, { status: 500 });
  }),
];
