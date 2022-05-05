import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import Category from '../../models/category';
import User from '../../models/user';
import { getUniqueSlug } from '../../utils/string';
import { RequestHandler } from 'express';

export const all: RequestHandler = async (req, res, next) => {
    try {
        const categories = await Category.findAll({ include: [
            { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
            { model: Category, as: 'parent', attributes: ['id', 'title'] }]
        });
        res.render('dashboard/categories', { title: 'News and Stories', categories });
    } catch (e) {
        next(e);
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.render('dashboard/categories/form', { title: 'News and Stories', categories });
    } catch (e) {
        next(e);
    }
    
};

export const save: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const title = req.body.title;
        const slug = await getUniqueSlug(Category, title, req.body.slug);
        const content = req.body.content;
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;
        const parentId = req.body.parent || null;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const categories = await Category.findAll();
            const inputValues = {
                title,
                slug,
                content,
                parentId,
                status,
                publishedAt
            }
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
        req.flash('success','New category created successfully!');
        res.redirect('/dashboard/categories');
    } catch (e) {
        next(e);
    }
};

export const edit: RequestHandler = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findByPk(categoryId);
        const categories = await Category.findAll({ where: { [Op.not]: { id: categoryId } }});
        // if (category && category.userId === req.user.id) {
        if (category) {
            res.render('dashboard/categories/form', { title: 'News and Stories', category, categories });
        } else {
            next(new Error('Category not found!'));
        }
    } catch (e) {
        next(e);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findByPk(categoryId);

        // if (category && category.userId === req.user.id) {
        if (category) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await getUniqueSlug(Category, title, updateSlug, category.id) : updateSlug;
            const content = req.body.content;
            const parentId = req.body.parent || null;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const image = req.file;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const categories = await Category.findAll();
                const inputValues = {
                    title,
                    slug,
                    content,
                    parentId,
                    status,
                    publishedAt
                }
                return res.status(400).render('dashboard/categories/form', { title: 'News and Stories', categories, category, inputValues, errorMessages: errors.array() });
            }
    
            await Category.update({
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
            req.flash('success','Category updated successfully!');
            res.redirect('/dashboard/categories');
        } else {
            next(new Error('Category not found!'));
        }
    } catch (e) {
        next(e)
    }
};

export const destroy: RequestHandler = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findByPk(categoryId);

        // if (category && category.userId === req.user.id) {
        if (category) {
            await Category.destroy({ where: { id: categoryId }, individualHooks: true });
            req.flash('success','Category deleted successfully!');
            res.json({ message: 'Deleting category succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'Category not found!', status: 404 });
        }
    } catch (e) {
        next(e);
    }
};