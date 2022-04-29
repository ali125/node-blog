const Post = require('../models/post');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');

exports.index = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'slug', 'title'] },
                { model: Tag, attributes: ['id', 'slug', 'title'] },
            ],
            order: [
                ['createdAt', 'DESC'],
                [Category, 'createdAt', 'DESC']
            ],
        });
        res.render('web/index', { title: 'News and Stories', posts });
    } catch (e) {
        next(e);
    }
}

exports.search = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'slug', 'title'] },
                { model: Tag, attributes: ['id', 'slug', 'title'] },
            ],
            order: [
                ['createdAt', 'DESC'],
                [Category, 'createdAt', 'DESC']
            ],
        });
        res.render('web/search', { title: 'News and Stories', posts });
    } catch (e) {
        next(e);
    }
}

exports.get = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const post = await Post.findOne({
            where: {
                slug
            },
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'slug', 'title'] },
                { model: Tag, attributes: ['id', 'slug', 'title'] },
            ],
            order: [
                [Category, 'createdAt', 'DESC']
            ],
        });
        if (!post) {
            const error = new Error('Post Not Found!');
            error.httpStatusCode = 404;
            return next(error);
        }
        res.render('web/post', { title: 'News and Stories', post });
    } catch (e) {
        next(e);
    }
}