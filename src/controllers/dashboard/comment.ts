import { validationResult } from 'express-validator';
import Comment from '../../models/comment';
import User from '../../models/user';
import Post from '../../models/post';
import { RequestHandler } from 'express';

export const all: RequestHandler = async (req, res, next) => {
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
        res.render('dashboard/comments', { title: 'News and Stories', comments });
    } catch (e) {
        next(e);
    }
}

export const view: RequestHandler<{ commentId: number }> = async (req, res, next) => {
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

export const reply: RequestHandler<{ commentId: number }> = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const commentId = req.params.commentId;
        const content = req.body.content;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0] as any );
            return res.redirect('/dashboard/comments');
        }
        const comment = await Comment.findByPk(commentId);

        if (comment) {
            await req.user.createComment({
                postId: comment.postId,
                parentId: commentId,
                content,
            });
            req.flash('success','Comment reply created successfully!');
            res.redirect('/dashboard/comments');
        } else {
            req.flash('error','Comment not found!');
            res.redirect('/dashboard/comments');
        }
    } catch (e) {
        next(e);
    }
}

export const junk: RequestHandler<{ commentId: number }> = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        await Comment.update({
            status: 'blocked'
        }, {
            individualHooks: true,
            // plain: true,
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

export const active: RequestHandler<{ commentId: number }> = async (req, res, next) => {
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
