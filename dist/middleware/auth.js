"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = (req, res, next) => {
    try {
        const isLoggedIn = req.session.isLoggedIn;
        if (!isLoggedIn)
            return res.redirect('/auth/login');
        next();
    }
    catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
exports.isAuth = isAuth;
