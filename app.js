// app.js
const express = require('express');
const connection = require('./db');  // Importar a conexão com o banco de dados

// Criar a aplicação Express
const app = express();

// permite que arquivos com funções estaticas funcionem ao mesmo tempo que o node.js
app.use(express.static('src/Arquivos_CSS&JS'));
app.use(express.static('src/Arquivos_CSS&JS/CSS'));

//(INICIO) Rotas para as paginas HTML

// Rota para pagina Inicio/index 
app.get('/', (req, res) => {
    
  res.sendFile(__dirname + '/src/Arquivos_HTML/index.html'); // Vai servir o arquivo HTML
});


//(FIM) Rotas para as paginas HTML


// servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000: http://localhost:3000");
});