import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1!P@ssword#',
  database: process.env.DB_NAME || 'pelada',
});

pool.on('error', (err) => {
  console.error('Erro no pool:', err);
});

export default pool;
