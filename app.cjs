const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const legalRouter = require('./routers/legalRouter.cjs');
const staticRouter = require('./routers/staticRouter.cjs');
const userRouter = require('./routers/userRouter.cjs');

app.use(express.static('public'));
app.use(express.static('public/static'));
app.use(express.static('public/static/paginas'));

app.use(legalRouter); 
app.use(staticRouter);
app.use(userRouter);

app.use(express.json)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});