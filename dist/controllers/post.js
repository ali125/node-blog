"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.search = exports.index = void 0;
const sequelize_1 = require("sequelize");
const post_1 = __importDefault(require("../models/post"));
const category_1 = __importDefault(require("../models/category"));
const tag_1 = __importDefault(require("../models/tag"));
const user_1 = __importDefault(require("../models/user"));
const comment_1 = __importDefault(require("../models/comment"));
const index = async (req, res, next) => {
    try {
        const posts = await post_1.default.findAll({
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
    }
    catch (e) {
        next(e);
    }
};
exports.index = index;
const search = async (req, res, next) => {
    try {
        const posts = await post_1.default.findAll({
            include: [
                { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName'] },
                { model: category_1.default, attributes: ['id', 'slug', 'title'] },
                { model: tag_1.default, attributes: ['id', 'slug', 'title'], through: { attributes: [] } },
            ],
            order: [
                ['createdAt', 'DESC'],
                [category_1.default, 'createdAt', 'DESC']
            ]
        });
        res.render('web/search', { title: 'News and Stories', posts });
    }
    catch (e) {
        next(e);
    }
};
exports.search = search;
const get = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const post = await post_1.default.findOne({
            where: {
                slug
            },
            include: [
                { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName'] },
                { model: category_1.default, attributes: ['id', 'slug', 'title'] },
                { model: tag_1.default, attributes: ['id', 'slug', 'title'], through: { attributes: [] } },
                {
                    model: comment_1.default,
                    where: { parentId: { [sequelize_1.Op.is]: null }, status: 'active' },
                    attributes: ['id', 'content', 'dateSince', 'createdAt'],
                    include: [
                        {
                            model: comment_1.default,
                            as: 'replies',
                            include: [{ model: user_1.default, attributes: ['id', 'avatar', 'fullName', 'firstName', 'lastName'] }],
                            attributes: ['id', 'content', 'dateSince', 'createdAt']
                        },
                        { model: user_1.default, attributes: ['id', 'avatar', 'fullName', 'firstName', 'lastName'] }
                    ],
                    limit: 10,
                    order: [['createdAt', 'DESC'], [comment_1.default, 'createdAt', 'DESC']]
                },
            ],
            order: [
                [category_1.default, 'createdAt', 'DESC'],
            ],
        });
        if (!post) {
            const error = new Error('Post Not Found!');
            error.httpStatusCode = 404;
            return next(error);
        }
        res.render('web/post', { title: 'News and Stories', post });
    }
    catch (e) {
        next(e);
    }
};
exports.get = get;
