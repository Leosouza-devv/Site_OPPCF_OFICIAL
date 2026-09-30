const express = require('express');
const app = express();
const path = require('path');
const userController = require(path.resolve(__dirname + '/../controllers/userController.cjs'));

const userRouter = require('express').Router();

userRouter.post('/api/user', userController.createUser);

userRouter.get('/api/user/:userID', userController.getUser);

module.exports = userRouter;