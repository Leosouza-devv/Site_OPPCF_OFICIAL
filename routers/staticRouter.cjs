const express = require('express');
const app = express();
const path = require('path');

const staticRouter = require('express').Router();

staticRouter.get('/linhas', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/static/paginas/LinhasDePesquisa_Geral.html'));
});

staticRouter.get('/eventos', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/static/paginas/Eventos.html'));
});

staticRouter.get('/cadastro', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/static/cadastro.html'));
});

module.exports = staticRouter;