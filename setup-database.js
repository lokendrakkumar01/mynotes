const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    console.log('\n========================================');
    console.log('🚀 NEON DATABASE SETUP');
    console.log('========================================\n');

    try {
        // Test connection
        console.log('📡 Testing database connection...');
        const testResult = await pool.query('SELECT NOW() as current_time');
        console.log('✅ Connected successfully at:', testResult.rows[0].current_time);

        // Read and execute schema
        console.log('\n📄 Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🔨 Creating database schema...');
        await pool.query(schema);
        console.log('✅ Database schema created successfully!');

        // Verify tables were created
        console.log('\n🔍 Verifying tables...');
        const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

        console.log('✅ Tables created:');
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        // Check if there's existing data to migrate
        console.log('\n📦 Checking for existing data...');
        const dataFile = path.join(__dirname, 'data.json');
        if (fs.existsSync(dataFile)) {
            console.log('📁 Found data.json - Ready for migration');
            console.log('⚠️  Run "node migrate-data.js" to migrate existing data');
        } else {
            console.log('ℹ️  No existing data.json found - Starting fresh');
        }

        console.log('\n========================================');
        console.log('✅ DATABASE SETUP COMPLETE!');
        console.log('========================================\n');
        console.log('Next steps:');
        console.log('1. If you have existing data: run "node migrate-data.js"');
        console.log('2. Start your server: npm start');
        console.log('========================================\n');

    } catch (error) {
        console.error('\n❌ ERROR during setup:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('👋 Database connection closed\n');
    }
}

// Run setup
setupDatabase();
