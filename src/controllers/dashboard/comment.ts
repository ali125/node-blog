import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import Comment from '../../models/comment';
import User from '../../models/user';
import Post from '../../models/post';

export const all = async (req, res, next) => {
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

export const view = async (req, res, next) => {
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

export const reply = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const content = req.body.content;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('success',errors.array()[0]);
            return res.redirect('/dashboard/comments';
        }
        const comment = await Comment.findByPk(commentId);
        await req.user.createComment({
            postId: comment.postId,
            parentId: commentId,
            content,
        });
        req.flash('success','Comment reply created successfully!';
        res.redirect('/dashboard/comments';
    } catch (e) {
        next(e);
    }
}

export const junk = async (req, res, next) => {
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
        req.flash('success','Comment junked successfully!';
        res.redirect('/dashboard/comments';
    } catch (e) {
        next(e);
    }
}

export const active = async (req, res, next) => {
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
        req.flash('success','Comment activated successfully!';
        res.redirect('/dashboard/comments';
    } catch (e) {
        next(e);
    }
}
