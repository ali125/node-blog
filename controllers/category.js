const { Op } = require('sequelize');
const Category = require('../models/category');
const User = require('../models/user');
const { getUniqueSlug } = require('../utils/string');

exports.all = async (req, res, next) => {
    try {
        const categories = await Category.findAll({ include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Category, as: 'parent', attributes: ['id', 'title'] }]
        });
        res.render('dashboard/categories', { title: 'News and Stories', categories });
    } catch (e) {
        console.log(e);
    }
}

exports.create = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.render('dashboard/categories/form', { title: 'News and Stories', categories });
    } catch (e) {
        console.log(e);
    }
    
};

exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = await getUniqueSlug(Category, title, req.body.slug);
        const content = req.body.content;
        const parentId = req.body.parent || null;
        const image = req.file;

        const category = await req.user.createCategory({
            title,
            slug,
            image: image ? `/${image.path}` : null,
            content,
            parentId
        });
        res.redirect('/dashboard/categories');
    } catch (e) {
        console.log(e);
    }
};

exports.edit = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findByPk(categoryId);
        const categories = await Category.findAll({ where: { [Op.not]: { id: categoryId } }});
        if (category && category.userId === req.user.id) {
            res.render('dashboard/categories/form', { title: 'News and Stories', category, categories });
        } else {
            next(new Error('Category not found!'));
        }
    } catch (e) {
        console.log(e);
    }
};

exports.update = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findByPk(categoryId);

        if (category && category.userId === req.user.id) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await getUniqueSlug(Category, title, updateSlug, category.id) : updateSlug;
            const content = req.body.content;
            const parentId = req.body.parent || null;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const image = req.file;
    
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
    
            res.redirect('/dashboard/categories');
        } else {
            next(new Error('Category not found!'));
        }
    } catch (e) {
        console.log(e);
    }
};

exports.destroy = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findByPk(categoryId);

        if (category && category.userId === req.user.id) {
            await Category.destroy({ where: { id: categoryId }});
            res.json({ message: 'Deleting category succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'Category not found!', status: 404 });
        }
    } catch (e) {
        console.log(e);
    }
};