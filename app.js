const express = require('express');
const path = require('path');
const connect = require('./models');
const morgan = require('morgan');
const { v4: uuidV4 } = require("uuid");
const indexRouter = require('./routes');

const app = express();
connect();
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// 라우터
app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    // res.locals.message = err.message;
    // res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    // res.status(err.status || 500);
    // res.render('error');
    console.log(err)
});

module.exports = app;