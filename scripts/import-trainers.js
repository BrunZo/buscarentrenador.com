require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function importTrainers() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  const client = await pool.connect();

  try {
    console.log('Connecting to database...');

    // Read CSV file
    const csvPath = path.join(__dirname, '../lib/trainers_import_staging.csv');
    console.log(`Reading CSV from ${csvPath}...`);
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Simple CSV parser that handles quoted fields
    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // Escaped quote
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    }

    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    const dataLines = lines.slice(1);

    console.log(`Found ${dataLines.length} rows to import`);

    // Start transaction
    await client.query('BEGIN');

    // Create temp table and set up constraints
    const setupSql = `
      CREATE TEMP TABLE tmp_trainer_import (
      email TEXT,
      name TEXT,
      surname TEXT,
      created_at TIMESTAMP,
      updated_at TIMESTAMP,
      city TEXT,
      province TEXT,
      places_lit TEXT,
      groups_lit TEXT,
      levels_lit TEXT
    ) ON COMMIT DROP;`;
    await client.query(setupSql);

    // Insert CSV data into temp table
    console.log('Inserting CSV data into temp table...');
    let inserted = 0;
    for (const line of dataLines) {
      if (!line.trim()) continue;

      const values = parseCSVLine(line);
      if (values.length < headers.length) {
        console.warn(`Skipping row: insufficient columns (${values.length} < ${headers.length})`);
        continue;
      }

      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] ? values[idx].trim() : null;
      });

      // Skip rows without email
      if (!row.email || row.email === '') {
        continue;
      }

      await client.query(
        `INSERT INTO tmp_trainer_import (email, name, surname, created_at, updated_at, city, province, places_lit, groups_lit, levels_lit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          row.email,
          row.name || null,
          row.surname || null,
          row.created_at || null,
          row.updated_at || null,
          row.city || null,
          row.province || null,
          row.places_lit || null,
          row.groups_lit || null,
          row.levels_lit || null,
        ]
      );
      inserted++;

      if (inserted % 10 === 0) {
        process.stdout.write(`\rInserted ${inserted}/${dataLines.length} rows...`);
      }
    }
    console.log(`\nInserted ${inserted} rows into temp table.`);

    console.log('CSV data inserted. Running upsert queries...');

    // Execute the rest of the SQL (upsert queries)
    const sql = fs.readFileSync(path.join(__dirname, '../lib/import_trainers.sql'), 'utf8');
    await client.query(sql);

    console.log('Trainers imported successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error importing trainers:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

importTrainers();
