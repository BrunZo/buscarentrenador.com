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

async function clearDatabase() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('Connecting to database...');
    
    const dropSchemaSql = `
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS trainers CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS verification_tokens CASCADE;
    `;
    await pool.query(dropSchemaSql);
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

clearDatabase();
