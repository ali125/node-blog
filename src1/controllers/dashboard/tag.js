const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const Tag = require('../../models/tag');
const User = require('../../models/user');
const { getUniqueSlug } = require('../../utils/string');

exports.all = async (req, res, next) => {
    try {
        const tags = await Tag.findAll({ include: { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']} });
        res.render('dashboard/tags', { title: 'News and Stories', tags });
    } catch (e) {
        next(e);
    }
}

exports.create = async (req, res, next) => {
    try {
        res.render('dashboard/tags/form', { title: 'News and Stories' });
    } catch (e) {
        next(e);
    }
    
};

exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = await getUniqueSlug(Tag, title, req.body.slug);
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                title,
                slug,
                status,
                publishedAt
            }
            return res.status(400).render('dashboard/tags/form', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }

        await req.user.createTag({
            title,
            slug,
            status,
            publishedAt
        });
        req.flash('success','New tag created successfully!');
        res.redirect('/dashboard/tags');
    } catch (e) {
        // console.log(e);
        next(e);
    }
};

exports.edit = async (req, res, next) => {
    try {
        const tagId = req.params.tagId;
        const tag = await Tag.findByPk(tagId);
        // if (tag && tag.userId === req.user.id) {
        if (tag) {
            res.render('dashboard/tags/form', { title: 'News and Stories', tag });
        } else {
            next(new Error('Tag not found!'));
        }
    } catch (e) {
        next(e);
    }
};

exports.update = async (req, res, next) => {
    try {
        const tagId = req.params.tagId;
        const tag = await Tag.findByPk(tagId);

        // if (tag && tag.userId === req.user.id) {
        if (tag) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await getUniqueSlug(Tag, title, updateSlug, tag.id) : updateSlug;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const inputValues = {
                    title,
                    slug,
                    status,
                    publishedAt
                }
                return res.status(400).render('dashboard/tags/form', { title: 'News and Stories', tag, inputValues, errorMessages: errors.array() });
            }
    
            await Tag.update({
                title,
                slug,
                status,
                publishedAt,
            }, {
                where: {
                    id: tagId
                }
            });
            req.flash('success','Tag updated successfully!');
            res.redirect('/dashboard/tags');
        } else {
            next(new Error('Tag not found!'));
        }
    } catch (e) {
        next(e)
    }
};

exports.destroy = async (req, res, next) => {
    const tagId = req.params.tagId;
    try {
        const tag = await Tag.findByPk(tagId);

        // if (tag && tag.userId === req.user.id) {
        if (tag) {
            await Tag.destroy({ where: { id: tagId }, individualHooks: true });
            req.flash('success','Tag deleted successfully!');
            res.json({ message: 'Deleting tag succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'Tag not found!', status: 404 });
        }
    } catch (e) {
        next(e);
    }
};