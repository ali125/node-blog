const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const auth = require('./middleware/auth');
const IndexRouter = require('./routes/index');
const PostRouter = require('./routes/post');
const AdminRouter = require('./routes/admin/index');
const User = require('./models/user');

const app = express();

const store = MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'session'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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
    const formData = req.session.formData;
    req.session.errorsMessage = null;
    req.session.formData = null;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.authUser = req.session.user;
    res.locals.errorsMessage = errorsMessage;
    res.locals.formData = formData;
    next();
});


app.use('/', IndexRouter);
app.use('/posts', PostRouter);
app.use('/admin', auth, AdminRouter);


mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(3000, () => {
        console.log('Server Started on port 3000');
    });
}).catch(err => {
    console.log(err)
});

