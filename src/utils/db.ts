import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'student_db',
  password: 'jk74',
  port: 5432,
});

export default pool;