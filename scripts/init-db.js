const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables BEFORE accessing process.env
// Try multiple possible locations for .env files
const rootDir = path.join(__dirname, '..');
const envPaths = [
  path.join(rootDir, '.env.local'),
  path.join(rootDir, '.env'),
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`Loaded environment variables from ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('No .env.local or .env file found, using default values');
}

async function initDatabase() {
  // Log the credentials being used (without showing password)
  console.log('Database configuration:');
  console.log(`  User: ${process.env.POSTGRES_USER || 'postgres'}`);
  console.log(`  Host: ${process.env.POSTGRES_HOST || 'localhost'}`);
  console.log(`  Database: ${process.env.POSTGRES_DATABASE || 'buscarentrenador'}`);
  console.log(`  Port: ${process.env.POSTGRES_PORT || '5432'}`);
  console.log(`  Password: ${process.env.POSTGRES_PASSWORD ? '***' : 'password (default)'}`);
  
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

initDatabase();
