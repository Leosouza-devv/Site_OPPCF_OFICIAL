require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'HTML', 'index.html'));
});

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS status');

    res.json({
      ok: true,
      database: 'connected',
      result: rows[0],
    });
  } catch (error) {
    console.error('Erro ao consultar o banco:', error.message);

    res.status(500).json({
      ok: false,
      database: 'disconnected',
      error: 'Nao foi possivel conectar ao banco de dados.',
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Servidor iniciado na porta ${PORT}: http://localhost:${PORT}`);

  try {
    await testConnection();
  } catch (error) {
    console.error('Falha ao conectar no MySQL ao iniciar:', error.message);
  }
});

app.get('/api/pesquisas', async (req, res) => {
  try {
    const [results] = await pool.query("SELECT titulo FROM artigos");
    res.json(results);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});