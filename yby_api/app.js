var express = require('express');
var path = require('path');
var logger = require('morgan');
require('./config/database')
var cors = require('cors')

var usersRouter = require('./app/routes/users');
var sensorsRouter = require('./app/routes/sensors');
var humiditiesRouter = require('./app/routes/humidities');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);
app.use('/humidities', humiditiesRouter);

module.exports = app;
