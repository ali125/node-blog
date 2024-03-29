import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';

import indexRouter from './routes/index';
import dashboardRouter from './routes/dashboard/index';
import authRouters from './routes/auth';
import sequelize from './config/db';

import { dateTimeFormate, dateFormate } from './utils/date';
import { isAuth } from './middleware/auth';
import User from './models/user';
import Category from './models/category';
import Post from './models/post';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

sequelize.sync({ alter: true }).then(() => {
  console.log('DB Synced');
});

dotenv.config();

const app = express();

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({ db: sequelize });

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET as string,
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


app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.path.includes('dashboard') && !req.path.includes('auth') && req.method.toUpperCase() === 'GET') {
    try {
      const mainCategories = await Category.findAll({
        attributes: ['slug', 'title'],
        where: { 
          [Op.and]: {
            parentId: null,
            status: 'published',
            publishedAt: {
                [Op.lt]: new Date(),
            }
          },
        }
      });
      res.locals.mainCategories = mainCategories;

      const categories = await Category.findAll({
        where: {
          [Op.and]: {
            status: 'published',
            publishedAt: {
                [Op.lt]: new Date(),
            }
          },
        },
        attributes: { 
          include: [[Sequelize.fn("COUNT", Sequelize.col("posts.id")), "postCount"]] 
        },
        include: [{
          model: Post, attributes: []
        }],
        raw: true,
        group: ['category.id']
      });
      // return res.json({ categories });
      res.locals.categories = categories;
    } catch(e) {
      console.log('categories err: ', e);
    }

    try {
      const owner = await User.findOne({ where: { role: 'owner' } });
      res.locals.owner = owner;
    } catch(e) {
      console.log('owner err: ', e);
    }
  }
  next();
});

app.use('/dashboard', isAuth, dashboardRouter);
app.use('/', indexRouter);
app.use('/auth', authRouters);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render(req.originalUrl.indexOf('/dashboard/') === 0 ? 'dashboard/error' : 'web/error');
});

module.exports = app;
