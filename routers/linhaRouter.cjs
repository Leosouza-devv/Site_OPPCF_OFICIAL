const express = require('express');
const app = express();
const path = require('path');
const linhaController = require(path.resolve(__dirname + '/../controllers/linhaController.cjs'));

const linhaRouter = require('express').Router();
console.log(linhaController);
linhaRouter.post('/api/linha', linhaController.createLinha);

linhaRouter.get('/linha/:linhaID', linhaController.getLinha);

module.exports = linhaRouter;