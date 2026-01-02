// Test database connection and permissions
import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:Dg%4016112003%40karaye@db.orokrcisrptwteoqijbs.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected!\n');

    // Test 1: Simple query
    console.log('Test 1: Simple SELECT...');
    const { rows } = await client.query('SELECT version()');
    console.log('✅ Query works:', rows[0].version.substring(0, 50) + '...\n');

    // Test 2: Create a test table
    console.log('Test 2: Creating test table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_migration (
        id SERIAL PRIMARY KEY,
        name TEXT
      );
    `);
    console.log('✅ Can create tables!\n');

    // Test 3: Check if test table exists
    console.log('Test 3: Verifying test table...');
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'test_migration';
    `);
    console.log('✅ Test table exists:', tables.length > 0 ? 'YES' : 'NO');
    
    if (tables.length > 0) {
      // Clean up
      await client.query('DROP TABLE test_migration;');
      console.log('✅ Cleaned up test table\n');
    }

    // Test 4: Check current user and permissions
    console.log('Test 4: Checking user permissions...');
    const { rows: userInfo } = await client.query('SELECT current_user, current_database();');
    console.log('Current user:', userInfo[0].current_user);
    console.log('Current database:', userInfo[0].current_database);
    console.log('✅ Permissions check complete\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

test();

