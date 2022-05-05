import { RequestHandler } from "express";

export const isAuth: RequestHandler = (req, res, next) => {
    try {
        const isLoggedIn = req.session.isLoggedIn;
        if(!isLoggedIn) return res.redirect('/auth/login');
        next();
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate.'});
    }
}