// Verify that migrations ran successfully
import pg from 'pg';
const { Client } = pg;

const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing connection string');
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

const expectedTables = [
  'users',
  'teams',
  'athletes',
  'tournaments',
  'categories',
  'category_participants',
  'matches',
  'kata_scores',
  'kumite_matches',
  'official_results',
  'tournament_rules',
];

async function verify() {
  try {
    await client.connect();
    console.log('\n🔍 Verifying database tables...\n');

    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const existingTables = rows.map(r => r.table_name);
    
    console.log(`Found ${existingTables.length} tables:\n`);
    existingTables.forEach(table => {
      const exists = expectedTables.includes(table);
      console.log(`  ${exists ? '✅' : '⚠️ '} ${table}`);
    });

    console.log('\n' + '='.repeat(50));
    const missing = expectedTables.filter(t => !existingTables.includes(t));
    
    if (missing.length === 0) {
      console.log('✅ All tables created successfully!');
    } else {
      console.log(`❌ Missing ${missing.length} table(s):`);
      missing.forEach(table => console.log(`   - ${table}`));
    }
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

verify();

