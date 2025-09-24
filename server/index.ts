import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const PORT = Number(process.env.PORT || 5174);
const DB_USER = process.env.POSTGRES_USER || 'booklib';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'booklib';
const DB_NAME = process.env.POSTGRES_DB || 'booklib';
const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
const DB_PORT = Number(process.env.POSTGRES_PORT || 5432);

const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
});

async function init() {
  // Create tables if they do not exist
  await pool.query(`
    create table if not exists authors (
      id serial primary key,
      name text not null,
      created_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists books (
      id serial primary key,
      title text not null,
      author_id integer references authors(id) on delete set null,
      created_at timestamptz not null default now()
    );
  `);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('select 1 as ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ status: 'error', error: (e as Error).message });
  }
});

// Find all authors
app.get('/api/authors', async (_req, res) => {
  try {
    const { rows } = await pool.query('select id, name, created_at from authors order by id desc');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// Find all books with author name joined
app.get('/api/books', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      select b.id, b.title, b.author_id, a.name as author, b.created_at
      from books b
      left join authors a on a.id = b.author_id
      order by b.id desc
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// Start server
init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to init DB', err);
    process.exit(1);
  });
