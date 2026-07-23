import express from 'express';
import mysql from 'mysql2/promise';
import fs from 'fs';
import { checkPolicy } from './validate.js';

const STUDENT_ID = '2400943';
const app = express();
let db;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// ---------- database ----------
async function connect() {
  for (let i = 0; i < 30; i++) {
    try {
      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10
      });
      await pool.query('SELECT 1');
      return pool;
    } catch {
      console.log('waiting for database...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error('database unreachable');
}

// load the NCSC 100k common-password list once
async function seedCommonPasswords() {
  const [[row]] = await db.query('SELECT COUNT(*) AS n FROM common_passwords');
  if (row.n > 0) return console.log(`common_passwords already loaded (${row.n})`);

  const file = '/data/common-passwords.txt';
  if (!fs.existsSync(file)) return console.warn('common-passwords.txt not found - skipping seed');

  const list = fs.readFileSync(file, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  for (let i = 0; i < list.length; i += 5000) {
    await db.query('INSERT IGNORE INTO common_passwords (password) VALUES ?',
      [list.slice(i, i + 5000).map(p => [p])]);
  }
  console.log(`seeded ${list.length} common passwords`);
}

async function isCommon(password) {
  const [rows] = await db.query('SELECT 1 FROM common_passwords WHERE password = ? LIMIT 1', [password]);
  return rows.length > 0;
}

// backend validation = policy + breached-list check
async function validate(password) {
  return checkPolicy(password) || (await isCommon(password)
    ? 'That password appears in a known breached password list.' : null);
}

// ---------- routes ----------
app.get('/', (req, res) => res.render('login', { error: null }));

app.get('/register', (req, res) => res.render('register', { error: null }));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const error = await validate(password);
  if (error) return res.render('login', { error });          // fail -> stay on home page
  res.render('welcome', { username, password });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.render('register', { error: 'Username is required.' });

  const error = await validate(password);
  if (error) return res.render('login', { error });           // fail -> return to home page

  // store username + creation time only (never the password)
  await db.query(`INSERT IGNORE INTO \`${STUDENT_ID}\` (username) VALUES (?)`, [username]);
  res.render('welcome', { username, password });
});

app.get('/logout', (req, res) => res.redirect('/'));

// ---------- start ----------
const PORT = 3000;
db = await connect();
await seedCommonPasswords();
app.listen(PORT, '0.0.0.0', () => console.log(`app listening on ${PORT}`));
