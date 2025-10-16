const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: 'postgres' // Connect to default database first
};

const targetDatabase = process.env.DB_NAME || 'bgf_aid_system';

async function setupDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('🔄 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Create database if it doesn't exist
    console.log(`🔄 Creating database "${targetDatabase}"...`);
    try {
      await client.query(`CREATE DATABASE ${targetDatabase}`);
      console.log(`✅ Database "${targetDatabase}" created successfully`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`ℹ️  Database "${targetDatabase}" already exists`);
      } else {
        throw error;
      }
    }

    await client.end();

    // Connect to the target database
    const targetClient = new Client({
      ...dbConfig,
      database: targetDatabase
    });

    await targetClient.connect();
    console.log(`✅ Connected to database "${targetDatabase}"`);

    // Read and execute schema.sql
    console.log('🔄 Setting up database schema...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    await targetClient.query(schemaSQL);
    console.log('✅ Database schema created successfully');

    // Read and execute test-data.sql
    console.log('🔄 Inserting test data...');
    const testDataSQL = fs.readFileSync(path.join(__dirname, 'database', 'test-data.sql'), 'utf8');
    await targetClient.query(testDataSQL);
    console.log('✅ Test data inserted successfully');

    await targetClient.end();

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Test User Credentials (password: password123):');
    console.log('   👤 Admin: admin@bgf.org');
    console.log('   🏛️  Founder: founder@bgf.org');
    console.log('   💼 CEO: ceo@bgf.org');
    console.log('   📊 Project Officer: officer@bgf.org');
    console.log('   👨‍💼 Program Manager: manager@bgf.org');
    console.log('   👩‍⚕️ Hospital Director: hospital@bgf.org');
    console.log('   💰 Finance Director: finance@bgf.org');
    console.log('   📝 Applicant: john.doe@email.com');
    console.log('');
    console.log('🚀 You can now start the backend server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 Make sure PostgreSQL is running:');
      console.log('   • macOS: brew services start postgresql');
      console.log('   • Linux: sudo systemctl start postgresql');
      console.log('   • Windows: Start PostgreSQL service');
      console.log('');
      console.log('🔧 Also check your database configuration in .env file:');
      console.log(`   DB_HOST=${process.env.DB_HOST || 'localhost'}`);
      console.log(`   DB_PORT=${process.env.DB_PORT || '5432'}`);
      console.log(`   DB_USER=${process.env.DB_USER || 'postgres'}`);
      console.log(`   DB_NAME=${process.env.DB_NAME || 'bgf_aid_system'}`);
    }
    
    process.exit(1);
  }
}

// Run the setup
setupDatabase();