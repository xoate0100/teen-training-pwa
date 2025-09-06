#!/usr/bin/env node

/**
 * Database initialization script for Teen Training PWA
 * This script sets up the Supabase database with schema and seed data
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

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

async function runSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 Running SQL file: ${path.basename(filePath)}`);

    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`❌ Error executing statement:`, error.message);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
          return false;
        }
      }
    }

    console.log(`✅ Successfully executed ${path.basename(filePath)}`);
    return true;
  } catch (err) {
    console.error(`❌ Error reading ${path.basename(filePath)}:`, err.message);
    return false;
  }
}

async function checkDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');
    // Test with a simple query that doesn't require existing tables
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    return false;
  }
}

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  // Check connection first
  const connected = await checkDatabaseConnection();
  if (!connected) {
    console.error('❌ Cannot proceed without database connection');
    process.exit(1);
  }

  console.log('\n📋 Setting up database schema...');

  // Run schema file
  const schemaPath = path.join(
    __dirname,
    '..',
    'lib',
    'database',
    'schema.sql'
  );
  const schemaSuccess = await runSQLFile(schemaPath);

  if (!schemaSuccess) {
    console.error('❌ Schema setup failed');
    process.exit(1);
  }

  console.log('\n🌱 Seeding database with sample data...');

  // Run seed data file
  const seedPath = path.join(
    __dirname,
    '..',
    'lib',
    'database',
    'seed-data.sql'
  );
  const seedSuccess = await runSQLFile(seedPath);

  if (!seedSuccess) {
    console.error('❌ Seed data setup failed');
    process.exit(1);
  }

  console.log('\n🎉 Database initialization complete!');
  console.log('\n📊 Database Summary:');
  console.log('   • Users table created with RLS policies');
  console.log('   • Exercise library populated with 12 exercises');
  console.log('   • Sample users and data inserted');
  console.log('   • API endpoints ready for testing');

  console.log('\n🔗 Next steps:');
  console.log('   1. Test API endpoints: npm run test:api');
  console.log('   2. Start development server: npm run dev');
  console.log('   3. Visit http://localhost:3000 to test the app');
}

// Run the initialization
initializeDatabase().catch(console.error);
