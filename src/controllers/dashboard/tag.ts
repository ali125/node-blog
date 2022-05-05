import { RequestHandler } from "express";
import { validationResult } from 'express-validator';
import Tag from '../../models/tag';
import User from '../../models/user';
import { getUniqueSlug } from '../../utils/string';

export const all: RequestHandler = async (req, res, next) => {
    try {
        const tags = await Tag.findAll({ include: { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']} });
        res.render('dashboard/tags', { title: 'News and Stories', tags });
    } catch (e) {
        next(e);
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {
        res.render('dashboard/tags/form', { title: 'News and Stories' });
    } catch (e) {
        next(e);
    }
    
};

export const save: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
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

export const edit: RequestHandler = async (req, res, next) => {
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

export const update: RequestHandler = async (req, res, next) => {
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

export const destroy: RequestHandler = async (req, res, next) => {
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