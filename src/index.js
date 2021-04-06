
require('dotenv').config();
const createError = require('http-errors');
const express = require ('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const app = express();

const {isAuthorized, isAdmin} = require('./app/middlewares/auth')
const { sendValidationErrors } = require('./app/helper/api-helper');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', require('./app/controller/ControllerAuht'));
app.use('/notas', isAuthorized, require('./app/controller/contrller-NotasNFE'));
app.use('/report', require('./app/controller/controoler-reportOccurences'));
app.use('/user', isAuthorized, require('./app/controller/ControllerUser'));
app.use('/cadastro', isAuthorized, require('./app/controller/controller-cadastro'));
app.use('/ballance', isAuthorized, require('./app/controller/controller-ballance'));
app.use('/search', isAuthorized, require('./app/controller/controller-search'));
app.use('/despensa', isAuthorized, require('./app/controller/controller-despensa'));
app.use('/', isAuthorized, require('./app/controller/projectControllerAuth'));
app.use(sendValidationErrors);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json(err);
  });

app.listen(process.env.PORT)