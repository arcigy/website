const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:GqgrZVcnGqvceVvcNnFqKFlzYULBtGoJ@yamabiko.proxy.rlwy.net:22648/railway',
});

async function check() {
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'AuditSubmission';
  `);
  res.rows.forEach(r => console.log(r.column_name + ' : ' + r.data_type));
  await client.end();
}

check().catch(console.error);
