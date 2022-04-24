const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
require('dotenv').config();

require('./models/_sync');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard/index');
const authRouters = require('./routes/auth');
const sequelize = require('./config/db');

const { dateTimeFormate, dateFormate } = require('./utils/date');
const { isAuth } = require('./middleware/auth');
const User = require('./models/user');

const app = express();

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({ db: sequelize });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(async (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.dateTimeFormate = dateTimeFormate;
  res.locals.dateFormate = dateFormate;
  
  if (req.session.user) {
    const usr = await User.findByPk(req.session.user.id);
    req.user = usr;
  }
  next();
});

app.use('/dashboard', isAuth, dashboardRouter);
app.use('/', indexRouter);
app.use('/auth', authRouters);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render(req.originalUrl.indexOf('/dashboard/') === 0 ? 'dashboard/error' : 'web/error');
});

module.exports = app;
