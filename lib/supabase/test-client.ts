import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for testing
export const createTestSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-testing';

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Mock database service for testing
export class MockDatabaseService {
  constructor() {
    // Mock implementation
  }

  async getUsers() {
    return {
      data: [
        {
          id: 'test-user-1',
          full_name: 'Test User',
          email: 'test@example.com',
          created_at: new Date().toISOString(),
        },
      ],
      error: null,
    };
  }

  async createUser(userData: any) {
    return {
      data: {
        id: 'test-user-1',
        ...userData,
        created_at: new Date().toISOString(),
      },
      error: null,
    };
  }

  async getSessions() {
    return {
      data: [],
      error: null,
    };
  }

  async createSession(sessionData: any) {
    return {
      data: {
        id: 'test-session-1',
        ...sessionData,
        created_at: new Date().toISOString(),
      },
      error: null,
    };
  }
}
