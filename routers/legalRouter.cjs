const express = require('express');
const app = express();
const path = require('path');

const staticRouter = require('express').Router();

staticRouter.get('/legal/privacidade', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/static/paginas/PoliticasDePrivacidade.html'));
});

staticRouter.get('/legal/ia', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/static/paginas/TermoDeUsoEticoDaIA.html'));
});

module.exports = staticRouter;