#!/usr/bin/env node

/**
 * API Testing script for Teen Training PWA
 * This script tests all API endpoints to ensure they're working correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

async function testAPIEndpoint(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
      return { success: true, data: result };
    } else {
      console.log(`❌ ${method} ${endpoint} - Status: ${response.status}`);
      console.log(`   Error: ${result.error || 'Unknown error'}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Network Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAPITests() {
  console.log('🧪 Starting API Tests...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  // Test 1: Get exercises
  console.log('📋 Testing Exercise Library...');
  const exercisesResult = await testAPIEndpoint('GET', '/api/exercises');
  results.total++;
  if (exercisesResult.success) {
    results.passed++;
    console.log(
      `   Found ${exercisesResult.data?.data?.length || 0} exercises`
    );
  } else {
    results.failed++;
  }

  // Test 2: Get sessions
  console.log('\n🏋️ Testing Sessions...');
  const sessionsResult = await testAPIEndpoint(
    'GET',
    `/api/sessions?user_id=${TEST_USER_ID}`
  );
  results.total++;
  if (sessionsResult.success) {
    results.passed++;
    console.log(`   Found ${sessionsResult.data?.data?.length || 0} sessions`);
  } else {
    results.failed++;
  }

  // Test 3: Get check-ins
  console.log('\n📊 Testing Check-ins...');
  const checkInsResult = await testAPIEndpoint(
    'GET',
    `/api/check-ins?user_id=${TEST_USER_ID}`
  );
  results.total++;
  if (checkInsResult.success) {
    results.passed++;
    console.log(`   Found ${checkInsResult.data?.data?.length || 0} check-ins`);
  } else {
    results.failed++;
  }

  // Test 4: Create a new check-in
  console.log('\n➕ Testing Check-in Creation...');
  const newCheckIn = {
    user_id: TEST_USER_ID,
    date: new Date().toISOString().split('T')[0],
    mood: 4,
    energy_level: 7,
    sleep_hours: 8.0,
    muscle_soreness: 2,
    notes: 'API test check-in',
  };
  const createCheckInResult = await testAPIEndpoint(
    'POST',
    '/api/check-ins',
    newCheckIn
  );
  results.total++;
  if (createCheckInResult.success) {
    results.passed++;
    console.log('   Check-in created successfully');
  } else {
    results.failed++;
  }

  // Test 5: Create a new session
  console.log('\n🏃 Testing Session Creation...');
  const newSession = {
    user_id: TEST_USER_ID,
    date: new Date().toISOString().split('T')[0],
    session_type: 'am',
    week_number: 1,
    day_number: 1,
  };
  const createSessionResult = await testAPIEndpoint(
    'POST',
    '/api/sessions',
    newSession
  );
  results.total++;
  if (createSessionResult.success) {
    results.passed++;
    console.log('   Session created successfully');
  } else {
    results.failed++;
  }

  // Test 6: Test database connection
  console.log('\n🔌 Testing Database Connection...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    results.total++;
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      results.failed++;
    } else {
      console.log('✅ Database connection successful');
      results.passed++;
    }
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    results.failed++;
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(
    `   📈 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`
  );

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! API is ready for use.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }

  return results.failed === 0;
}

// Run the tests
runAPITests().catch(console.error);
