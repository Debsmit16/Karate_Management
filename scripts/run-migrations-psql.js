// Script to run migrations using PostgreSQL connection
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
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
  console.log('2. Click "Settings" (gear icon) → "Database"');
  console.log('3. Scroll down to "Connection string"');
  console.log('4. Select "URI" tab');
  console.log('5. Copy the connection string (it looks like:');
  console.log('   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres)\n');
  console.log('💡 OR use "Direct connection" for migrations\n');
  console.log('📝 Usage:');
  console.log('   node scripts/run-migrations-psql.js "postgresql://postgres:password@host:port/dbname"');
  console.log('   OR set DATABASE_URL environment variable\n');
  process.exit(1);
}

const migrationFiles = [
  '001_initial_schema.sql',
  '002_rls_policies.sql',
  '003_functions_and_triggers.sql',
];

async function runMigration(file, connectionString) {
  const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
  const sql = readFileSync(filePath, 'utf-8');

  console.log(`📄 Running: ${file}...`);

  try {
    // Use psql to execute the SQL
    const { stdout, stderr } = await execAsync(
      `psql "${connectionString}" -c "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    );

    if (stderr && !stderr.includes('NOTICE')) {
      console.error(`   ⚠️  Warnings: ${stderr}`);
    }

    console.log(`   ✅ Success!\n`);
    return true;
  } catch (error) {
    // Try alternative: write SQL to temp file and execute
    try {
      const tempFile = join(__dirname, '..', 'temp_migration.sql');
      const fs = await import('fs/promises');
      await fs.writeFile(tempFile, sql);
      
      const { stdout, stderr } = await execAsync(
        `psql "${connectionString}" -f "${tempFile}"`,
        { maxBuffer: 10 * 1024 * 1024 }
      );

      await fs.unlink(tempFile);

      if (stderr && !stderr.includes('NOTICE')) {
        console.error(`   ⚠️  Warnings: ${stderr}`);
      }

      console.log(`   ✅ Success!\n`);
      return true;
    } catch (error2) {
      console.error(`   ❌ Error: ${error2.message}`);
      console.error(`   Please run this migration manually in Supabase SQL Editor\n`);
      return false;
    }
  }
}

async function main() {
  console.log('🚀 Starting migrations...\n');

  for (const file of migrationFiles) {
    const success = await runMigration(file, connectionString);
    if (!success) {
      console.log('⚠️  Some migrations failed. Please check errors above.\n');
    }
  }

  console.log('✨ Migration process completed!');
  console.log('\n🔍 Verify in Supabase Dashboard → Table Editor');
  console.log('   You should see 11 tables created.\n');
}

main().catch(console.error);

