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

// exports.create = async (req, res, next) => {
//     try {
//         res.render('dashboard/comments/form', { title: 'News and Stories' });
//     } catch (e) {
//         next(e);
//     }
    
// };

// exports.save = async (req, res, next) => {
//     try {
//         const content = req.body.content;
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             const comments = await Comment.findAll();
//             const inputValues = {
//                 content
//             }
//             return res.status(400).render('dashboard/comments/form', { title: 'News and Stories', comments, inputValues, errorMessages: errors.array() });
//         }
//         const comment = await req.user.createComment({
//             content
//         });
//         req.flash('success','New comment created successfully!');
//         res.redirect('/dashboard/comments');
//     } catch (e) {
//         next(e);
//     }
// };

// exports.edit = async (req, res, next) => {
//     try {
//         const commentId = req.params.commentId;
//         const comment = await Comment.findByPk(commentId);
//         if (comment && comment.userId === req.user.id) {
//             res.render('dashboard/comments/form', { title: 'News and Stories', comment });
//         } else {
//             next(new Error('comment not found!'));
//         }
//     } catch (e) {
//         next(e);
//     }
// };

// exports.update = async (req, res, next) => {
//     try {
//         const commentId = req.params.commentId;
//         const comment = await Comment.findByPk(commentId);

//         if (comment && comment.userId === req.user.id) {
//             const title = req.body.title;
//             const updateSlug = req.body.slug;
//             const content = req.body.content;
//             const parentId = req.body.parent || null;
//             const status = req.body.status;
//             const publishedAt = req.body.publishedAt || null;
//             const image = req.file;

//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 const comments = await Comment.findAll();
//                 const inputValues = {
//                     title,
//                     slug,
//                     content,
//                     parentId,
//                     status,
//                     publishedAt
//                 }
//                 return res.status(400).render('dashboard/comments/form', { title: 'News and Stories', comments, comment, inputValues, errorMessages: errors.array() });
//             }
    
//             await Comment.update({
//                 title,
//                 slug,
//                 image: image ? `/${image.path}` : undefined,
//                 content,
//                 status,
//                 publishedAt,
//                 parentId
//             }, {
//                 where: {
//                     id: commentId
//                 }
//             });
//             req.flash('success','comment updated successfully!');
//             res.redirect('/dashboard/comments');
//         } else {
//             next(new Error('comment not found!'));
//         }
//     } catch (e) {
//         next(e)
//     }
// };

// exports.destroy = async (req, res, next) => {
//     const commentId = req.params.commentId;
//     try {
//         const comment = await Comment.findByPk(commentId);

//         if (comment && comment.userId === req.user.id) {
//             await Comment.destroy({ where: { id: commentId }});
//             req.flash('success','comment deleted successfully!');
//             res.json({ message: 'Deleting comment succeed!', status: 204 });
//         } else {
//             res.status(404).json({ message: 'comment not found!', status: 404 });
//         }
//     } catch (e) {
//         next(e);
//     }
// };