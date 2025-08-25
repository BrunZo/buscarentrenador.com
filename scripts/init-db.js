const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DATABASE || 'buscarentrenador',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
  });

  try {
    console.log('Connecting to database...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Creating tables...');
    await pool.query(schema);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Load environment variables if .env.local exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('No .env.local file found, using default values');
}

initDatabase();
