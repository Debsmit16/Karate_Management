// Migration Guide Script
// This script helps you run migrations in Supabase SQL Editor

console.log('\n' + '='.repeat(70));
console.log('🥋 KARATE TOURNAMENT MANAGEMENT - DATABASE MIGRATION GUIDE');
console.log('='.repeat(70) + '\n');

console.log('📋 STEP-BY-STEP INSTRUCTIONS:\n');
console.log('1. Open your browser and go to: https://app.supabase.com');
console.log('2. Select your project: orokrcisrptwteoqijbs');
console.log('3. Click "SQL Editor" in the left sidebar');
console.log('4. Click "New query" button\n');

console.log('5. Run each migration file IN ORDER:\n');

const migrations = [
  {
    file: '001_initial_schema.sql',
    description: 'Creates all database tables and indexes',
    order: 1,
  },
  {
    file: '002_rls_policies.sql',
    description: 'Sets up Row Level Security policies',
    order: 2,
  },
  {
    file: '003_functions_and_triggers.sql',
    description: 'Creates database functions and triggers',
    order: 3,
  },
];

migrations.forEach((migration, index) => {
  console.log(`   ${migration.order}. ${migration.file}`);
  console.log(`      → ${migration.description}`);
  console.log(`      → File location: supabase/migrations/${migration.file}`);
  console.log(`      → Copy the entire file content and paste into SQL Editor`);
  console.log(`      → Click "Run" (or press Ctrl+Enter)`);
  if (index < migrations.length - 1) {
    console.log(`      → Wait for success message, then proceed to next file\n`);
  } else {
    console.log(`      → Done! ✅\n`);
  }
});

console.log('='.repeat(70));
console.log('💡 TIP: You can open the migration files in your code editor');
console.log('   and copy-paste them one by one into the Supabase SQL Editor.');
console.log('='.repeat(70) + '\n');

console.log('🔍 VERIFICATION:');
console.log('After running all migrations, verify in Supabase Dashboard:');
console.log('   → Go to "Table Editor"');
console.log('   → You should see these tables:');
console.log('      • users');
console.log('      • teams');
console.log('      • athletes');
console.log('      • tournaments');
console.log('      • categories');
console.log('      • category_participants');
console.log('      • matches');
console.log('      • kata_scores');
console.log('      • kumite_matches');
console.log('      • official_results');
console.log('      • tournament_rules\n');

console.log('✅ Once migrations are complete, you can:');
console.log('   1. Create your .env file with Supabase credentials');
console.log('   2. Run: npm run dev');
console.log('   3. Sign up as an admin user\n');

