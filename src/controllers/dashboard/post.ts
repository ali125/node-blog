import { validationResult } from 'express-validator';
import Post from '../../models/post';
import Category from '../../models/category';
import Tag from '../../models/tag';
import User from '../../models/user';
import { getUniqueSlug } from '../../utils/string';
import { RequestHandler } from 'express';

export const all: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const posts = await req.user.getPosts({
            include: [
                { model: User, attributes: ['id', 'fullName', 'firstName', 'lastName']},
                { model: Category, attributes: ['id', 'title'] },
            ],
            order: [
                ['createdAt', 'DESC'],
                [Category, 'createdAt', 'DESC']  
            ],
        });
        res.render('dashboard/posts', { title: 'News and Stories', posts });
    } catch (e) {
        console.log(e);
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {
        const tags = await Tag.findAll({ attributes: ['id', 'title'] });
        const categories = await Category.findAll({ attributes: ['id', 'title']});
        res.render('dashboard/posts/form', { title: 'News and Stories', categories, tags });
    } catch (e) {
        console.log(e);
    }
};

export const save: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const title = req.body.title;
        const slug = await getUniqueSlug(Post, title, req.body.slug);
        const content = req.body.content;
        const categoryId = req.body.categoryId;
        const tagsId = req.body.tags;
        const status = req.body.status;
        const publishedAt = req.body.publishedAt || null;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const tags = await Tag.findAll({ attributes: ['id', 'title'] });
            const categories = await Category.findAll({ attributes: ['id', 'title']});
            const inputValues = {
                title,
                slug,
                content,
                categoryId,
                status,
                publishedAt
            }
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
        req.flash('success','New post created successfully!');
        res.redirect('/dashboard/posts');
    } catch (e) {
        console.log(e);
    }
};

export const edit: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const postId = req.params.postId;
        const post = await Post.findByPk(postId, { plain: true, include: [{ model: Tag, attributes: ['id'], through: { attributes: [] } }]});
        if (post && post.userId === req.user.id) {
            const postJson = post.toJSON();
            postJson.tags = postJson.tags.map((i: Tag) => i.id);
            const categories = await Category.findAll({ attributes: ['id', 'title']});
            const tags = await Tag.findAll({ attributes: ['id', 'title'] });
            res.render('dashboard/posts/form', { title: 'News and Stories', post: postJson, tags, categories });
        } else {
            next(new Error('Post not found!'));
        }
    } catch (e) {
        console.log(e);
    }
};

export const update: RequestHandler<{ postId: string }> = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);

        if (post && post.userId === req.user.id) {
            const title = req.body.title;
            const updateSlug = req.body.slug;
            const slug = updateSlug ? await getUniqueSlug(Post, title, updateSlug, +postId) : updateSlug;
            const content = req.body.content;
            const categoryId = req.body.categoryId;
            const tagsId = req.body.tags;
            const status = req.body.status;
            const publishedAt = req.body.publishedAt || null;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const postData = await Post.findByPk(postId, { plain: true, include: [{ model: Tag, attributes: ['id'], through: { attributes: [] } }]});
                const postJson = postData ? postData.toJSON() : {};
                postJson.tags = (postJson?.tags || []).map((i: Tag) => i.id);
                const tags = await Tag.findAll({ attributes: ['id', 'title'] });
                const categories = await Category.findAll({ attributes: ['id', 'title']});
                const inputValues = {
                    title,
                    slug,
                    content,
                    categoryId,
                    status,
                    publishedAt
                }
                return res.status(400).render('dashboard/posts/form', { title: 'News and Stories', categories, tags, inputValues, post: postJson, errorMessages: errors.array() });
            }
            
            const image = req.file;
    
            await Post.update({
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
            req.flash('success','Post updated successfully!');
            res.redirect('/dashboard/posts');
        } else {
            next(new Error('Post not found!'));
        }
    } catch (e) {
        console.log(e);
    }
};

export const destroy: RequestHandler = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        if (!req.user) return res.status(401).send({ error: 'Please authenticate.'});
        const post = await Post.findByPk(postId);

        if (post && post.userId === req.user.id) {
            await Post.destroy({ where: { id: postId }, individualHooks: true});
            req.flash('success','Post deleted successfully!');
            res.json({ message: 'Deleting post succeed!', status: 204 });
        } else {
            res.status(404).json({ message: 'Post not found!', status: 404 });
        }
    } catch (e) {
        console.log(e);
    }
};