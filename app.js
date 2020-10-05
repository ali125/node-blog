const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const stringHelper = require('./util/string');

const IndexRouter = require('./routes/index');
const User = require('./models/user');

const app = express();

const store = MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'session'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencoded
// app.use(bodyParser.json()); // application/json
// res.json({ response });
// app.use((req, res, next) => { // CORS ERROR
//     // res.setHeader('Access-Control-Allow-Origin', 'codepen.io, url');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Types, Authorization');
//     next();
// });
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(flash());

app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            return next();
        }
        const user = await User.findById(req.session.user._id);
        req.user = user;
        next();
    } catch(err) {
        console.log('err', err);
    }
});

app.use((req, res, next) => {
    const errorsMessage = req.session.errorsMessage;
    const successMessage = req.session.successMessage;
    const formData = req.session.formData;
    req.session.errorsMessage = null;
    req.session.successMessage = null;
    req.session.formData = null;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.authUser = req.session.user;
    res.locals.errorsMessage = errorsMessage;
    res.locals.successMessage = successMessage;
    res.locals.formData = formData;
    res.locals.truncateText = stringHelper.truncateText;

    res.locals.formatDate = stringHelper.formatDate;

    next();
});

app.use('/500', (req, res, next) => {
    res.status(500).render('errors/500');
});

app.use('/', IndexRouter);

app.use((req, res, next) => {
    res.status(404).render('errors/404');
});

app.use((errors, req, res, next) => {
    console.log(errors);
    res.render('errors/500');
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(3000, () => {
        console.log('Server Started on port 3000');
    });
}).catch(err => {
    console.log(err)
});

