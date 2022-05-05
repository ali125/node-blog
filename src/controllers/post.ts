import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import Post from '../models/post';
import Category from '../models/category';
import Tag from '../models/tag';
import User from '../models/user';
import Comment from '../models/comment';

export const index: RequestHandler = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            // include: [
            //     { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
            //     { model: Category, attributes: ['id', 'slug', 'title'] },
            //     { model: Tag, attributes: ['id', 'slug', 'title'] },
            // ],
            // order: [
            //     ['createdAt', 'DESC'],
            //     [Category, 'createdAt', 'DESC']
            // ],
        });
        res.render('web/index', { title: 'News and Stories', posts });
    } catch (e) {
        next(e);
    }
}

export const search: RequestHandler = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'slug', 'title'] },
                { model: Tag, attributes: ['id', 'slug', 'title'], through: { attributes: []}},
            ],
            order: [
                ['createdAt', 'DESC'],
                [Category, 'createdAt', 'DESC']
            ]
        });
        res.render('web/search', { title: 'News and Stories', posts });
    } catch (e) {
        next(e);
    }
}

export const get: RequestHandler = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const post = await Post.findOne({
            where: {
                slug
            },
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'slug', 'title'] },
                { model: Tag, attributes: ['id', 'slug', 'title'], through: { attributes: []}},
                {
                    model: Comment,
                    where: { parentId: { [Op.is]: null }, status: 'active' },
                    attributes: ['id', 'content', 'dateSince', 'createdAt'],
                    include: [
                        {
                            model: Comment,
                            as: 'replies',
                            include: [{ model: User, attributes: ['id', 'avatar', 'fullName', 'firstName', 'lastName'] }],
                            attributes: ['id', 'content', 'dateSince', 'createdAt']
                        },
                        { model: User, attributes: ['id', 'avatar', 'fullName', 'firstName', 'lastName'] }
                    ],
                    limit: 10,
                    order: [['createdAt', 'DESC'], [Comment, 'createdAt', 'DESC']]
                },
            ],
            order: [
                [Category, 'createdAt', 'DESC'],
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
};