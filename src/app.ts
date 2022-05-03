import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
require('dotenv').config();

import('./models/_sync');

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import dashboardRouter from './routes/dashboard/index';
import authRouters from './routes/auth';
import sequelize from './config/db';

import { dateTimeFormate, dateFormate } from './utils/date';
import { isAuth } from './middleware/auth';
import User from './models/user';

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
app.use(flash());
app.use(async (req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.session.user;
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.dateTimeFormate = dateTimeFormate;
  res.locals.dateFormate = dateFormate;

  const errorMessages = req.flash('error');
  const successMessage = req.flash('success');
  res.locals.successMessage = successMessage.length > 0 ? successMessage[0] : null;
  res.locals.errorMessages = errorMessages.length > 0 ? errorMessages : null;
  
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status((err as { status: any }).status || 500);
  res.render(req.originalUrl.indexOf('/dashboard/') === 0 ? 'dashboard/error' : 'web/error';
});

export default app;
