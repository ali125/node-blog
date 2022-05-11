import { RequestHandler } from "express";

export const AboutUs: RequestHandler = (req, res, next) => {
    try {
        res.render('web/about', { title: 'About Us' });
    } catch (e) {
        next(e);
    }
};

export const Contact: RequestHandler = (req, res, next) => {
    try {
        res.render('web/contact', { title: 'Contact Us' });
    } catch (e) {
        next(e);
    }
};

export const ContactPost: RequestHandler = (req, res, next) => {
    try {
        return res.redirect('/contact')
    } catch (e) {
        next(e);
    }
};