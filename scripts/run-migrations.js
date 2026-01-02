import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Supabase credentials from environment or command line args
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.argv[2];
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.argv[3];

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Usage: node run-migrations.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
  console.error('Or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Migration files in order
const migrationFiles = [
  '001_initial_schema.sql',
  '002_rls_policies.sql',
  '003_functions_and_triggers.sql',
];

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
  console.log(`📡 Connecting to: ${supabaseUrl}\n`);

  for (const file of migrationFiles) {
    try {
      console.log(`📄 Running migration: ${file}...`);
      
      const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
      const sql = readFileSync(filePath, 'utf-8');

      // Execute SQL using Supabase RPC or direct query
      // Note: We need to use the service role key for migrations
      // For now, we'll use the REST API approach
      
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

      if (error) {
        // If RPC doesn't exist, try using the REST API directly
        // We'll need to use the service role key for this
        console.log(`⚠️  RPC method not available, trying alternative method...`);
        
        // Alternative: Use fetch to call Supabase REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ sql_query: sql }),
        });

        if (!response.ok) {
          // If that doesn't work, we'll need to guide user to use SQL Editor
          console.error(`❌ Error running ${file}`);
          console.error('   Migration needs to be run manually in Supabase SQL Editor');
          console.error(`   File location: ${filePath}\n`);
          continue;
        }
      }

      console.log(`✅ Successfully ran: ${file}\n`);
    } catch (err) {
      console.error(`❌ Error running ${file}:`, err.message);
      console.error(`   Please run this migration manually in Supabase SQL Editor\n`);
    }
  }

  console.log('✨ Migration process completed!');
  console.log('\n📝 Note: Some migrations may need to be run manually in Supabase SQL Editor');
  console.log('   Go to: https://app.supabase.com → Your Project → SQL Editor');
}

runMigrations().catch(console.error);

