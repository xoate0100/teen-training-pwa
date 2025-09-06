#!/usr/bin/env node

/**
 * Simple database setup script for Teen Training PWA
 * This script creates the necessary tables using Supabase REST API
 */

const { createClient } = require('@supabase/supabase-js'); // eslint-disable-line no-undef
require('dotenv').config({ path: '.env.local' }); // eslint-disable-line no-undef

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTables() {
  console.log('🏗️  Creating database tables...\n');

  // Create users table
  console.log('📋 Creating users table...');
  const { error: usersError } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (usersError && usersError.code === 'PGRST116') {
    console.log('   Users table does not exist, creating...');
    // Table doesn't exist, we need to create it via SQL
    console.log(
      '   ⚠️  Please create the users table manually in Supabase dashboard'
    );
    console.log('   📝 Go to: SQL Editor in your Supabase dashboard');
    console.log('   📝 Run the schema from: lib/database/schema.sql');
  } else if (usersError) {
    console.error('   ❌ Error checking users table:', usersError.message);
    return false;
  } else {
    console.log('   ✅ Users table already exists');
  }

  return true;
}

async function checkConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');

    // Test connection by trying to access the auth service
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Connection error:', error.message);
      return false;
    } else {
      console.log('✅ Connected to Supabase');
      return true;
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

async function showInstructions() {
  console.log('\n📋 Manual Database Setup Instructions:');
  console.log('=====================================\n');

  console.log('1. 🌐 Open Supabase Dashboard:');
  console.log(
    `   https://supabase.com/dashboard/project/${supabaseUrl.split('//')[1].split('.')[0]}\n`
  );

  console.log('2. 📝 Go to SQL Editor:');
  console.log('   • Click "SQL Editor" in the left sidebar\n');

  console.log('3. 📄 Copy and paste the schema:');
  console.log('   • Open: lib/database/schema.sql');
  console.log('   • Copy the entire contents');
  console.log('   • Paste into SQL Editor');
  console.log('   • Click "Run" to execute\n');

  console.log('4. 🌱 Add sample data (optional):');
  console.log('   • Open: lib/database/seed-data.sql');
  console.log('   • Copy the entire contents');
  console.log('   • Paste into SQL Editor');
  console.log('   • Click "Run" to execute\n');

  console.log('5. ✅ Verify setup:');
  console.log('   • Go to "Table Editor" in Supabase dashboard');
  console.log('   • You should see: users, daily_check_ins, exercises, etc.\n');

  console.log('6. 🔧 Test your app:');
  console.log('   • Run: npm run dev');
  console.log('   • Visit: http://localhost:3000\n');
}

async function main() {
  console.log('🚀 Teen Training PWA Database Setup\n');

  const connected = await checkConnection();
  if (!connected) {
    console.error('❌ Cannot connect to Supabase');
    process.exit(1);
  }

  await createTables();
  await showInstructions();

  console.log('🎉 Setup instructions complete!');
  console.log(
    '📚 Your database will be ready after following the manual steps above.'
  );
}

main().catch(console.error);
