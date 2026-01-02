import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get credentials from command line or environment
const supabaseUrl = process.argv[2] || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.argv[3] || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('\nUsage: node scripts/execute-migrations.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
  console.error('Example: node scripts/execute-migrations.js https://xxx.supabase.co eyJhbGc...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationFiles = [
  '001_initial_schema.sql',
  '002_rls_policies.sql',
  '003_functions_and_triggers.sql',
];

async function executeSQL(sql) {
  // Try using Supabase REST API directly
  // Note: This may not work for DDL operations with anon key
  // We'll need to use the SQL Editor for DDL operations
  
  try {
    // Try using the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (response.ok) {
      return { success: true };
    }
  } catch (err) {
    // Ignore errors, we'll fall back to manual method
  }

  return { success: false, reason: 'DDL operations require service role key or SQL Editor' };
}

async function runMigrations() {
  console.log('🚀 Attempting to run database migrations...\n');
  console.log(`📡 Supabase URL: ${supabaseUrl}\n`);

  // Test connection first
  try {
    const { data, error } = await supabase.from('tournaments').select('count').limit(0);
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected)
      console.log('⚠️  Note: Some tables may not exist yet (this is expected)\n');
    }
  } catch (err) {
    console.log('⚠️  Connection test completed\n');
  }

  const results = [];

  for (const file of migrationFiles) {
    console.log(`📄 Processing: ${file}...`);
    
    const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
    const sql = readFileSync(filePath, 'utf-8');

    // For DDL operations, we need to use the SQL Editor
    // The anon key doesn't have permissions for CREATE TABLE, etc.
    console.log(`   ⚠️  DDL operations require manual execution in Supabase SQL Editor`);
    console.log(`   📋 SQL is ready to copy from: ${filePath}\n`);
    
    results.push({
      file,
      status: 'manual_required',
      sql,
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('📝 MANUAL MIGRATION REQUIRED');
  console.log('='.repeat(70));
  console.log('\nDDL operations (CREATE TABLE, etc.) cannot be executed with the anon key.');
  console.log('You need to run these migrations manually in the Supabase SQL Editor.\n');
  console.log('Steps:');
  console.log('1. Go to: https://app.supabase.com');
  console.log('2. Select your project');
  console.log('3. Click "SQL Editor" in the left sidebar');
  console.log('4. Click "New query"');
  console.log('5. Copy and paste each migration file in order:');
  console.log('   - supabase/migrations/001_initial_schema.sql');
  console.log('   - supabase/migrations/002_rls_policies.sql');
  console.log('   - supabase/migrations/003_functions_and_triggers.sql');
  console.log('6. Click "Run" (or press Ctrl+Enter) for each file\n');
  console.log('='.repeat(70) + '\n');

  // Optionally, we could try to open the files or copy them to clipboard
  // But for now, we'll just provide clear instructions

  return results;
}

runMigrations().catch(console.error);

