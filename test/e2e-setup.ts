// E2E Test Setup
import { test as base } from '@playwright/test';

// Set up test environment
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key-for-testing';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key-for-testing';
process.env.DISABLE_ANALYTICS = 'true';
process.env.DISABLE_TELEMETRY = 'true';

// Export test with setup
export const test = base;
