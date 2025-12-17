// server.js - Express backend con auth básica (SQLite + JWT), formulario de contacto y envío por SMTP
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const Database = require('sqlite3');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const db = new Database(path.join(__dirname, 'data.db'));
// Inicializar tabla users si no existe
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)`).run();

// Registro
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hashed);
    const user = { id: info.lastInsertRowid, name, email };
    const token = jwt.sign(user, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ ok: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Email ya registrado' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(401).json({ error: 'Credenciales inválidas' });
  const ok = await bcrypt.compare(password, row.password);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
  const user = { id: row.id, name: row.name, email: row.email };
  const token = jwt.sign(user, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ ok: true, user, token });
});

// Middleware autenticado ejemplo
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No autorizado' });
  const token = header.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Endpoint de contacto (envía email)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Faltan campos' });
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.sendMail({
      from: `"Auditoría Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
      subject: `Contacto web: ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error enviando email' });
  }
});

// Ruta protegida de ejemplo
app.get('/api/me', auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000; // Render asigna el puerto automáticamente
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


