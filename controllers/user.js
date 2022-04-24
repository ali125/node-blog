const User = require('../models/user');

exports.loginView = async (req, res, next) => {
    try {
        res.render('auth/login', { title: 'News and Stories' });
    } catch (e) {
        console.log(e);
    }
}
exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password);
        const user = await User.findByCredentials(email, password);
        if (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.redirect('/auth/login');
        }
    } catch (e) {
        res.redirect('/auth/login');
    }
}

exports.registerView = async (req, res, next) => {
    try {
        res.render('auth/register', { title: 'News and Stories' });
    } catch (e) {
        console.log(e);
    }
}
exports.register = async (req, res, next) => {
    try {
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (e) {
        res.redirect('/auth/register');
    }
}

exports.logout = async (req, res, next) => {
    try {
        req.session.isLoggedIn = false;
        req.session.user = null;
        res.redirect('/auth/login');
    } catch (e) {
        console.log(e);
    }
}