"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.update = exports.edit = exports.save = exports.create = exports.all = void 0;
const express_validator_1 = require("express-validator");
const post_1 = __importDefault(require("../../models/post"));
const category_1 = __importDefault(require("../../models/category"));
const tag_1 = __importDefault(require("../../models/tag"));
const user_1 = __importDefault(require("../../models/user"));
const string_1 = require("../../utils/string");
const all = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const posts = await req.user.getPosts({
            include: [
                { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName'] },
                { model: category_1.default, attributes: ['id', 'title'] },
            ],
            order: [
                ['createdAt', 'DESC'],
                [category_1.default, 'createdAt', 'DESC']
            ],
        });
        res.render('dashboard/posts', { title: 'News and Stories', posts });
    }
    catch (e) {
        console.log(e);
    }
};
exports.all = all;
const create = async (req, res, next) => {
    try {
        const tags = await tag_1.default.findAll({ attributes: ['id', 'title'] });
        const categories = await category_1.default.findAll({ attributes: ['id', 'title'] });
        res.render('dashboard/posts/form', { title: 'News and Stories', categories, tags });
    }
    catch (e) {
        console.log(e);
    }
};
exports.create = create;
const save = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const title = req.body.title;
        const slug = await (0, string_1.getUniqueSlug)(post_1.default, title, req.body.slug);
        const content = req.body.content;
        const categoryId = req.body.categoryId;
        const tagsId = req.body.tags;
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const tags = await tag_1.default.findAll({ attributes: ['id', 'title'] });
            const categories = await category_1.default.findAll({ attributes: ['id', 'title'] });
            const inputValues = {
                title,
                slug,
                content,
                categoryId,
                status,
                publishedAt
            };
            return res.status(400).render('dashboard/posts/form', { title: 'News and Stories', categories, tags, inputValues, errorMessages: errors.array() });
        }
        const image = req.file;
        const post = await req.user.createPost({
            title,
            slug,
            image: image ? image.path.replace('public', '') : undefined,
            content,
            status,
            publishedAt
        });
        post.setTags(tagsId);
        post.setCategory(categoryId);
        req.flash('success', 'New post created successfully!');
        res.redirect('/dashboard/posts');
    }
    catch (e) {
        console.log(e);
    }
};
exports.save = save;
const edit = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const postId = req.params.postId;
        const post = await post_1.default.findByPk(postId, { plain: true, include: [{ model: tag_1.default, attributes: ['id'], through: { attributes: [] } }] });
        if (post && post.userId === req.user.id) {
            const postJson = post.toJSON();
            postJson.tags = postJson.tags.map((i) => i.id);
            const categories = await category_1.default.findAll({ attributes: ['id', 'title'] });
            const tags = await tag_1.default.findAll({ attributes: ['id', 'title'] });
            res.render('dashboard/posts/form', { title: 'News and Stories', post: postJson, tags, categories });
        }
        else {
            next(new Error('Post not found!'));
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.edit = edit;
const update = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const postId = req.params.postId;
        const post = await post_1.default.findByPk(postId);
        if (post && post.userId === req.user.id) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await (0, string_1.getUniqueSlug)(post_1.default, title, updateSlug, +postId) : updateSlug;
            const content = req.body.content;
            const categoryId = req.body.categoryId;
            const tagsId = req.body.tags;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const postData = await post_1.default.findByPk(postId, { plain: true, include: [{ model: tag_1.default, attributes: ['id'], through: { attributes: [] } }] });
                const postJson = postData ? postData.toJSON() : {};
                postJson.tags = ((postJson === null || postJson === void 0 ? void 0 : postJson.tags) || []).map((i) => i.id);
                const tags = await tag_1.default.findAll({ attributes: ['id', 'title'] });
                const categories = await category_1.default.findAll({ attributes: ['id', 'title'] });
                const inputValues = {
                    title,
                    slug,
                    content,
                    categoryId,
                    status,
                    publishedAt
                };
                return res.status(400).render('dashboard/posts/form', { title: 'News and Stories', categories, tags, inputValues, post: postJson, errorMessages: errors.array() });
            }
            const image = req.file;
            await post_1.default.update({
                title,
                slug,
                image: image ? image.path.replace('public', '') : undefined,
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
            req.flash('success', 'Post updated successfully!');
            res.redirect('/dashboard/posts');
        }
        else {
            next(new Error('Post not found!'));
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.update = update;
const destroy = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const post = await post_1.default.findByPk(postId);
        if (post && post.userId === req.user.id) {
            await post_1.default.destroy({ where: { id: postId }, individualHooks: true });
            req.flash('success', 'Post deleted successfully!');
            res.json({ message: 'Deleting post succeed!', status: 204 });
        }
        else {
            res.status(404).json({ message: 'Post not found!', status: 404 });
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.destroy = destroy;
