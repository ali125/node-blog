import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import Post from '../models/post';
import Category from '../models/category';
import Tag from '../models/tag';
import User from '../models/user';
import Comment from '../models/comment';
import { Sequelize } from 'sequelize-typescript';

export const index: RequestHandler = async (req, res, next) => {
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

export const search: RequestHandler = async (req, res, next) => {
    try {
        const page = +(req.query.page || 1);
        const author = req.query.author;
        const query = req.query.search || null;
        const category = req.query.category || null;
        const tags = ((req.query.tags as string || '').split(',') || []).filter(i => i).map((i) => +i);
        const conditions: any[] = []

        if (category) conditions.push({ '$category.slug$': category });
        if (tags.length > 0) conditions.push({ '$tags.id$': { [Op.in]: tags } });
        if (author) conditions.push({ '$user.id$': author });

        if (query) {
            conditions.push({
                [Op.or]: {
                    'title': {
                        [Op.iLike]: `%${query}%`
                    },
                    'slug': {
                        [Op.iLike]: `%${query}%`
                    },
                    'content': {
                        [Op.iLike]: `%${query}%`
                    }
                }
            });
        }
        const posts = await Post.findAll({
            where: {
                [Op.and]: conditions,
            },
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'slug', 'title'] },
                { model: Tag, attributes: ['id', 'slug', 'title'], through: { attributes: [] } },
            ],
            order: [
                ['createdAt', 'DESC'],
                [Category, 'createdAt', 'DESC']
            ],
            limit: 10,
            offset: (page - 1) / 10
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
                    separate: true,
                    where: { parentId: { [Op.is]: null }, status: 'active' },
                    attributes: ['id', 'content', 'dateSince', 'createdAt'],
                    include: [
                        {
                            model: Comment,
                            as: 'replies',
                            attributes: ['id', 'content', 'dateSince', 'createdAt'],
                            include: [{ model: User, attributes: ['id', 'avatar', 'fullName', 'firstName', 'lastName'] }],
                        },
                        { model: User, attributes: ['id', 'avatar', 'fullName', 'firstName', 'lastName'] }
                    ],
                    // // limit: 10,
                    // order: [[Comment, 'createdAt', 'DESC']]
                },
            ],
            order: [
                [Category, 'createdAt', 'DESC'],
            ],
        });
        // return res.json({ post });
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