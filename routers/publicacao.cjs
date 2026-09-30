const express = require('express');
const app = express();
const path = require('path');
const publicacaoController = require(path.resolve(__dirname + '/../controllers/publicacaoController.cjs'));

const publicacaoRouter = require('express').Router();

publicacaoRouter.post('/api/publicacao', publicacaoController.createpublicacao);

publicacaoRouter.get('/api/publicacao/:publicacaoID', publicacaoController.getpublicacao);

module.exports = publicacaoRouter;