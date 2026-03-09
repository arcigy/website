const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:cJwgyQeUNkqiJVArXVZDYwjmUhUNGTWn@shinkansen.proxy.rlwy.net:25911/railway",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to NEW database!');
    const res = await client.query('SELECT NOW()');
    console.log('Response:', res.rows[0]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
