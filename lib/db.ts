import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Set timezone to Argentina for all connections
pool.on('connect', (client) => {
  client.query("SET timezone = 'America/Argentina/Buenos_Aires'");
});

export default pool;
