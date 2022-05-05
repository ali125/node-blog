"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.update = exports.edit = exports.save = exports.create = exports.all = void 0;
const sequelize_1 = require("sequelize");
const express_validator_1 = require("express-validator");
const category_1 = __importDefault(require("../../models/category"));
const user_1 = __importDefault(require("../../models/user"));
const string_1 = require("../../utils/string");
const all = async (req, res, next) => {
    try {
        const categories = await category_1.default.findAll({ include: [
                { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName'] },
                { model: category_1.default, as: 'parent', attributes: ['id', 'title'] }
            ]
        });
        res.render('dashboard/categories', { title: 'News and Stories', categories });
    }
    catch (e) {
        next(e);
    }
};
exports.all = all;
const create = async (req, res, next) => {
    try {
        const categories = await category_1.default.findAll();
        res.render('dashboard/categories/form', { title: 'News and Stories', categories });
    }
    catch (e) {
        next(e);
    }
};
exports.create = create;
const save = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const title = req.body.title;
        const slug = await (0, string_1.getUniqueSlug)(category_1.default, title, req.body.slug);
        const content = req.body.content;
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;
        const parentId = req.body.parent || null;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const categories = await category_1.default.findAll();
            const inputValues = {
                title,
                slug,
                content,
                parentId,
                status,
                publishedAt
            };
            return res.status(400).render('dashboard/categories/form', { title: 'News and Stories', categories, inputValues, errorMessages: errors.array() });
        }
        const image = req.file;
        await req.user.createCategory({
            title,
            slug,
            image: image ? `/${image.path}` : null,
            content,
            parentId,
            status,
            publishedAt
        });
        req.flash('success', 'New category created successfully!');
        res.redirect('/dashboard/categories');
    }
    catch (e) {
        next(e);
    }
};
exports.save = save;
const edit = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await category_1.default.findByPk(categoryId);
        const categories = await category_1.default.findAll({ where: { [sequelize_1.Op.not]: { id: categoryId } } });
        // if (category && category.userId === req.user.id) {
        if (category) {
            res.render('dashboard/categories/form', { title: 'News and Stories', category, categories });
        }
        else {
            next(new Error('Category not found!'));
        }
    }
    catch (e) {
        next(e);
    }
};
exports.edit = edit;
const update = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await category_1.default.findByPk(categoryId);
        // if (category && category.userId === req.user.id) {
        if (category) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await (0, string_1.getUniqueSlug)(category_1.default, title, updateSlug, category.id) : updateSlug;
            const content = req.body.content;
            const parentId = req.body.parent || null;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const image = req.file;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const categories = await category_1.default.findAll();
                const inputValues = {
                    title,
                    slug,
                    content,
                    parentId,
                    status,
                    publishedAt
                };
                return res.status(400).render('dashboard/categories/form', { title: 'News and Stories', categories, category, inputValues, errorMessages: errors.array() });
            }
            await category_1.default.update({
                title,
                slug,
                image: image ? `/${image.path}` : undefined,
                content,
                status,
                publishedAt,
                parentId
            }, {
                where: {
                    id: categoryId
                }
            });
            req.flash('success', 'Category updated successfully!');
            res.redirect('/dashboard/categories');
        }
        else {
            next(new Error('Category not found!'));
        }
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const destroy = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await category_1.default.findByPk(categoryId);
        // if (category && category.userId === req.user.id) {
        if (category) {
            await category_1.default.destroy({ where: { id: categoryId }, individualHooks: true });
            req.flash('success', 'Category deleted successfully!');
            res.json({ message: 'Deleting category succeed!', status: 204 });
        }
        else {
            res.status(404).json({ message: 'Category not found!', status: 404 });
        }
    }
    catch (e) {
        next(e);
    }
};
exports.destroy = destroy;
