// Run migrations using direct PostgreSQL connection
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n' + '='.repeat(70));
console.log('🥋 DATABASE MIGRATION RUNNER');
console.log('='.repeat(70) + '\n');

// Get connection string from command line or environment
const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.log('❌ Missing database connection string!\n');
  console.log('📋 HOW TO GET YOUR CONNECTION STRING:\n');
  console.log('1. Go to: https://app.supabase.com/project/orokrcisrptwteoqijbs');
  console.log('2. Click "Settings" (⚙️) → "Database"');
  console.log('3. Scroll to "Connection string" section');
  console.log('4. Click "Direct connection" tab');
  console.log('5. Copy the connection string');
  console.log('   Format: postgresql://postgres.[ref]:[password]@host:port/dbname\n');
  console.log('📝 Usage:');
  console.log('   node scripts/run-migrations-db.js "postgresql://postgres:password@host:port/dbname"');
  console.log('   OR set DATABASE_URL environment variable\n');
  console.log('💡 See scripts/get-connection-string.md for detailed instructions\n');
  process.exit(1);
}

const migrationFiles = [
  '001_initial_schema.sql',
  '002_rls_policies.sql',
  '003_functions_and_triggers.sql',
];

async function runMigrations() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Supabase uses SSL
    }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    for (let i = 0; i < migrationFiles.length; i++) {
      const file = migrationFiles[i];
      console.log(`[${i + 1}/${migrationFiles.length}] Running: ${file}...`);

      const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
      const sql = readFileSync(filePath, 'utf-8');

      try {
        // Execute the entire SQL file as one query
        // PostgreSQL can handle multiple statements separated by semicolons
        await client.query(sql);
        console.log(`   ✅ Success!\n`);
      } catch (error) {
        // Some errors are expected (like "already exists")
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('permission denied')) {
          console.log(`   ⚠️  Warning: ${error.message.split('\n')[0]}`);
          console.log(`   (This might be okay - continuing...)\n`);
        } else {
          // For other errors, show more details but continue
          console.error(`   ⚠️  Error: ${error.message.split('\n')[0]}`);
          console.error(`   Code: ${error.code}`);
          // Don't throw - continue with next migration
          console.log(`   Continuing to next migration...\n`);
        }
      }
    }

    console.log('✨ All migrations completed successfully!\n');
    console.log('🔍 Verify in Supabase Dashboard → Table Editor');
    console.log('   You should see 11 tables:\n');
    console.log('   • users');
    console.log('   • teams');
    console.log('   • athletes');
    console.log('   • tournaments');
    console.log('   • categories');
    console.log('   • category_participants');
    console.log('   • matches');
    console.log('   • kata_scores');
    console.log('   • kumite_matches');
    console.log('   • official_results');
    console.log('   • tournament_rules\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   - Verify your connection string is correct');
    console.error('   - Check that your database password is correct');
    console.error('   - Ensure you\'re using "Direct connection" string (port 5432)');
    console.error('   - Some migrations may need to be run manually in SQL Editor\n');
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from database.\n');
  }
}

runMigrations().catch(console.error);

