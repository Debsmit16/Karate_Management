// Simple script to display migration SQL for manual execution
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationFiles = [
  '001_initial_schema.sql',
  '002_rls_policies.sql',
  '003_functions_and_triggers.sql',
];

console.log('📋 Database Migration SQL Files\n');
console.log('='.repeat(60));
console.log('Copy and paste each SQL file into Supabase SQL Editor\n');
console.log('Go to: https://app.supabase.com → Your Project → SQL Editor\n');
console.log('='.repeat(60) + '\n');

for (const file of migrationFiles) {
  const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
  const sql = readFileSync(filePath, 'utf-8');
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`FILE: ${file}`);
  console.log('='.repeat(60));
  console.log(sql);
  console.log('\n');
}

