const Post = require('../models/post');
const { getUniqueSlug } = require('../utils/string');
const { Op } = require("sequelize");
const e = require('express');
exports.all = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        res.render('dashboard/posts', { title: 'News and Stories', posts });
    } catch (e) {
        console.log(e);
    }
}

exports.create = async (req, res, next) => {
    try {
        res.render('dashboard/posts/form', { title: 'News and Stories' });
    } catch (e) {
        console.log(e);
    }
    
};

exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = await getUniqueSlug(Post, title, req.body.slug);
        const content = req.body.content;
        const image = req.file;

        const post = await Post.create({
            title,
            slug,
            image: `/${image.path}`,
            content
        });

        res.redirect('/dashboard/posts');
    } catch (e) {
        console.log(e);
    }
};

exports.edit = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);
        if (post) {
            res.render('dashboard/posts/form', { title: 'News and Stories', post });
        } else {
            next(new Error('Post not found!'));
        }
    } catch (e) {
        console.log(e);
    }
};

exports.update = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);

        if (post) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await getUniqueSlug(Post, title, updateSlug, post.id) : updateSlug;
            const content = req.body.content;
            const image = req.file;
    
            await Post.update({
                title,
                slug,
                image: image ? `/${image.path}` : undefined,
                content
            }, {
                where: {
                    id: postId
                }
            });
    
            res.redirect('/dashboard/posts');
        } else {
            next(new Error('Post not found!'));
        }
    } catch (e) {
        console.log(e);
    }
};

exports.destroy = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId);

        if (post) {
            await Post.destroy({ where: { id: postId }});
            res.json({ message: 'Deleting post succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'Post not found!', status: 404 });
        }
    } catch (e) {
        console.log(e);
    }
};