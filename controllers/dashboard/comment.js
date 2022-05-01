const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const Comment = require('../../models/comment');
const User = require('../../models/user');
const Post = require('../../models/post');

exports.all = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Post, attributes: ['id', 'title', 'slug']},
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        // return res.json({ comments });
        res.render('dashboard/comments', { title: 'News and Stories', comments });
    } catch (e) {
        next(e);
    }
}

exports.view = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const data = await Comment.findByPk(commentId, {
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName', 'email']},
                { model: Post, attributes: ['id', 'title', 'slug']},
            ]
        });
        res.json({ data, status: 200 });
    } catch (e) {
        next(e);
    }
}

exports.reply = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const content = req.body.content;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('success',errors.array()[0]);
            return res.redirect('/dashboard/comments');
        }
        const comment = await Comment.findByPk(commentId);
        await req.user.createComment({
            postId: comment.postId,
            parentId: commentId,
            content,
        });
        req.flash('success','Comment reply created successfully!');
        res.redirect('/dashboard/comments');
    } catch (e) {
        next(e);
    }
}

exports.junk = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        await Comment.update({
            status: 'blocked'
        }, {
            individualHooks: true,
            plain: true,
            where: {
                id: commentId
            }
        });
        req.flash('success','Comment junked successfully!');
        res.redirect('/dashboard/comments');
    } catch (e) {
        next(e);
    }
}

exports.active = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        await Comment.update({
            status: 'active'
        }, {
            individualHooks: true,
            where: {
                id: commentId
            }
        });
        req.flash('success','Comment activated successfully!');
        res.redirect('/dashboard/comments');
    } catch (e) {
        next(e);
    }
}
