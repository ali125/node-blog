const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const IndexRouter = require('./routes/index');
const PostRouter = require('./routes/post');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    try {
        const user = await User.findOne();
        req.user = user;
        next();
    } catch(err) {
        console.log('err', err);
    }
});

app.use('/', IndexRouter);
app.use('/posts', PostRouter);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(3000, () => {
        console.log('Server Started on port 3000');
    });
}).catch(err => {
    console.log(err)
});

