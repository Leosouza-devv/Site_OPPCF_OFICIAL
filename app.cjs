const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const legalRouter = require('./routers/legalRouter.cjs');
const staticRouter = require('./routers/staticRouter.cjs');
const userRouter = require('./routers/userRouter.cjs');
const linhaRouter = require('./routers/linhaRouter.cjs');
const publicacaoRouter = require('./routers/publicacao.cjs');


app.use(express.static('public'));
app.use(express.static('public/static'));
app.use(express.static('public/static/paginas'));

app.use(bodyParser.json());

app.use(legalRouter); 
app.use(staticRouter);
app.use(userRouter);
app.use(linhaRouter);
app.use(publicacaoRouter);

app.set('views', './views')
app.set('view engine', 'pug');

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});