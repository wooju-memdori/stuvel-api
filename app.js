const express = require('express');
const path = require('path');
const connect = require('./models');
const morgan = require('morgan');

const userRouter = require('./routes/users');

const bodyParser = require('body-parser');

const app = express();
connect();
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




module.exports = app;