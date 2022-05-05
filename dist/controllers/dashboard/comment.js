"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.active = exports.junk = exports.reply = exports.view = exports.all = void 0;
const express_validator_1 = require("express-validator");
const comment_1 = __importDefault(require("../../models/comment"));
const user_1 = __importDefault(require("../../models/user"));
const post_1 = __importDefault(require("../../models/post"));
const all = async (req, res, next) => {
    try {
        const comments = await comment_1.default.findAll({
            include: [
                { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName'] },
                { model: post_1.default, attributes: ['id', 'title', 'slug'] },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.render('dashboard/comments', { title: 'News and Stories', comments });
    }
    catch (e) {
        next(e);
    }
};
exports.all = all;
const view = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const data = await comment_1.default.findByPk(commentId, {
            include: [
                { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName', 'email'] },
                { model: post_1.default, attributes: ['id', 'title', 'slug'] },
            ]
        });
        res.json({ data, status: 200 });
    }
    catch (e) {
        next(e);
    }
};
exports.view = view;
const reply = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const commentId = req.params.commentId;
        const content = req.body.content;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0]);
            return res.redirect('/dashboard/comments');
        }
        const comment = await comment_1.default.findByPk(commentId);
        if (comment) {
            await req.user.createComment({
                postId: comment.postId,
                parentId: commentId,
                content,
            });
            req.flash('success', 'Comment reply created successfully!');
            res.redirect('/dashboard/comments');
        }
        else {
            req.flash('error', 'Comment not found!');
            res.redirect('/dashboard/comments');
        }
    }
    catch (e) {
        next(e);
    }
};
exports.reply = reply;
const junk = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        await comment_1.default.update({
            status: 'blocked'
        }, {
            individualHooks: true,
            // plain: true,
            where: {
                id: commentId
            }
        });
        req.flash('success', 'Comment junked successfully!');
        res.redirect('/dashboard/comments');
    }
    catch (e) {
        next(e);
    }
};
exports.junk = junk;
const active = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        await comment_1.default.update({
            status: 'active'
        }, {
            individualHooks: true,
            where: {
                id: commentId
            }
        });
        req.flash('success', 'Comment activated successfully!');
        res.redirect('/dashboard/comments');
    }
    catch (e) {
        next(e);
    }
};
exports.active = active;
