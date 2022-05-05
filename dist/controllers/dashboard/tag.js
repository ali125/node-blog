"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.update = exports.edit = exports.save = exports.create = exports.all = void 0;
const express_validator_1 = require("express-validator");
const tag_1 = __importDefault(require("../../models/tag"));
const user_1 = __importDefault(require("../../models/user"));
const string_1 = require("../../utils/string");
const all = async (req, res, next) => {
    try {
        const tags = await tag_1.default.findAll({ include: { model: user_1.default, attributes: ['id', 'fullName', 'firstName', 'lastName'] } });
        res.render('dashboard/tags', { title: 'News and Stories', tags });
    }
    catch (e) {
        next(e);
    }
};
exports.all = all;
const create = async (req, res, next) => {
    try {
        res.render('dashboard/tags/form', { title: 'News and Stories' });
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
        const slug = await (0, string_1.getUniqueSlug)(tag_1.default, title, req.body.slug);
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                title,
                slug,
                status,
                publishedAt
            };
            return res.status(400).render('dashboard/tags/form', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        await req.user.createTag({
            title,
            slug,
            status,
            publishedAt
        });
        req.flash('success', 'New tag created successfully!');
        res.redirect('/dashboard/tags');
    }
    catch (e) {
        // console.log(e);
        next(e);
    }
};
exports.save = save;
const edit = async (req, res, next) => {
    try {
        const tagId = req.params.tagId;
        const tag = await tag_1.default.findByPk(tagId);
        // if (tag && tag.userId === req.user.id) {
        if (tag) {
            res.render('dashboard/tags/form', { title: 'News and Stories', tag });
        }
        else {
            next(new Error('Tag not found!'));
        }
    }
    catch (e) {
        next(e);
    }
};
exports.edit = edit;
const update = async (req, res, next) => {
    try {
        const tagId = req.params.tagId;
        const tag = await tag_1.default.findByPk(tagId);
        // if (tag && tag.userId === req.user.id) {
        if (tag) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await (0, string_1.getUniqueSlug)(tag_1.default, title, updateSlug, tag.id) : updateSlug;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const inputValues = {
                    title,
                    slug,
                    status,
                    publishedAt
                };
                return res.status(400).render('dashboard/tags/form', { title: 'News and Stories', tag, inputValues, errorMessages: errors.array() });
            }
            await tag_1.default.update({
                title,
                slug,
                status,
                publishedAt,
            }, {
                where: {
                    id: tagId
                }
            });
            req.flash('success', 'Tag updated successfully!');
            res.redirect('/dashboard/tags');
        }
        else {
            next(new Error('Tag not found!'));
        }
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const destroy = async (req, res, next) => {
    const tagId = req.params.tagId;
    try {
        const tag = await tag_1.default.findByPk(tagId);
        // if (tag && tag.userId === req.user.id) {
        if (tag) {
            await tag_1.default.destroy({ where: { id: tagId }, individualHooks: true });
            req.flash('success', 'Tag deleted successfully!');
            res.json({ message: 'Deleting tag succeed!', status: 204 });
        }
        else {
            res.status(404).json({ message: 'Tag not found!', status: 404 });
        }
    }
    catch (e) {
        next(e);
    }
};
exports.destroy = destroy;
