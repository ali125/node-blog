const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');
const { getUniqueSlug } = require('../utils/string');

exports.all = async (req, res, next) => {
    try {
        const posts = await req.user.getPosts({
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'title'] },
            ],
            order: [
                [Category, 'createdAt', 'DESC']  
            ],
        });
        res.render('dashboard/posts', { title: 'News and Stories', posts });
    } catch (e) {
        console.log(e);
    }
}

exports.create = async (req, res, next) => {
    try {
        const tags = await Tag.findAll({ attributes: ['id', 'title'] });
        const categories = await Category.findAll({ attributes: ['id', 'title']});
        res.render('dashboard/posts/form', { title: 'News and Stories', categories, tags });
    } catch (e) {
        console.log(e);
    }
};

exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = await getUniqueSlug(Post, title, req.body.slug);
        const content = req.body.content;
        const categoryId = req.body.categoryId;
        const tagsId = req.body.tags;
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const tags = await Tag.findAll({ attributes: ['id', 'title'] });
            const categories = await Category.findAll({ attributes: ['id', 'title']});
            const inputValues = {
                title,
                slug,
                content,
                categoryId,
                status,
                publishedAt
            }
            return res.status(400).render('dashboard/posts/form', { title: 'News and Stories', categories, tags, inputValues, errorMessages: errors.array() });
        }
        const image = req.file;
        const post = await req.user.createPost({
            title,
            slug,
            image: `/${image.path}`,
            content,
            status,
            publishedAt
        });
        post.setTags(tagsId);
        post.setCategory(categoryId);
        req.flash('success','New post created successfully!');
        res.redirect('/dashboard/posts');
    } catch (e) {
        console.log(e);
    }
};

exports.edit = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId, { plain: true, include: [{ model: Tag, attributes: ['id'], through: { attributes: [] } }]});
        if (post && post.userId === req.user.id) {
            const postJson = post.toJSON();
            postJson.tags = postJson.tags.map((i) => i.id);
            const categories = await Category.findAll({ attributes: ['id', 'title']});
            const tags = await Tag.findAll({ attributes: ['id', 'title'] });
            res.render('dashboard/posts/form', { title: 'News and Stories', post: postJson, tags, categories });
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

        if (post && post.userId === req.user.id) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await getUniqueSlug(Post, title, updateSlug, postId) : updateSlug;
            const content = req.body.content;
            const categoryId = req.body.categoryId;
            const tagsId = req.body.tags;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const postData = await Post.findByPk(postId, { plain: true, include: [{ model: Tag, attributes: ['id'], through: { attributes: [] } }]});
                const postJson = postData.toJSON();
                postJson.tags = postJson.tags.map((i) => i.id);
                const tags = await Tag.findAll({ attributes: ['id', 'title'] });
                const categories = await Category.findAll({ attributes: ['id', 'title']});
                const inputValues = {
                    title,
                    slug,
                    content,
                    categoryId,
                    status,
                    publishedAt
                }
                return res.status(400).render('dashboard/posts/form', { title: 'News and Stories', categories, tags, inputValues, post: postJson, errorMessages: errors.array() });
            }
            
            const image = req.file;
    
            await Post.update({
                title,
                slug,
                image: image ? `/${image.path}` : undefined,
                content,
                status,
                publishedAt
            }, {
                where: {
                    id: postId
                }
            });
            post.setTags(tagsId);
            post.setCategory(categoryId || null);
            req.flash('success','Post updated successfully!');
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

        if (post && post.userId === req.user.id) {
            await Post.destroy({ where: { id: postId }});
            req.flash('success','Post deleted successfully!');
            res.json({ message: 'Deleting post succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'Post not found!', status: 404 });
        }
    } catch (e) {
        console.log(e);
    }
};