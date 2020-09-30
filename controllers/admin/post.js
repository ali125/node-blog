const { validationResult } = require('express-validator/check');
const Post = require('../../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const data = await Post.find().populate('userId').exec();
        res.render('admin/posts/list', {
            headTitle: 'Posts List',
            data
        });
    } catch(err) {
        console.log('err', err);
    }
};
exports.addPost = async (req, res, next) => {
    try {
        res.render('admin/posts/form');
    } catch(err) {
        console.log('err', err);
    }
};
exports.savePost = async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const errors = validationResult(req);
        const body = {
            title,
            content,
            userId: req.user._id
        };
        if(!errors.isEmpty()) {
            req.session.errorsMessage = errors.array();
            req.session.formData = {
                title,
                content
            };
            return res.redirect('/admin/posts/add');
        }
        const post = new Post(body);
        await post.save();
        res.redirect('/admin/posts')
    } catch(err) {
        console.log('err', err);
    }
};

exports.editPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Post.findById(id).populate('userId').exec();
        res.render('admin/posts/form', {
            headTitle: 'Edit Post',
            formData: data
        });
    } catch(err) {
        console.log('err', err);
    }
};
exports.updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const content = req.body.content;
        const body = {
            title,
            content
        };
        await Post.findOneAndUpdate(id, body);
        res.redirect('/admin/posts')
    } catch(err) {
        console.log('err', err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Post.findByIdAndDelete(id);
        res.redirect('/admin/posts')
    } catch(err) {
        console.log('err', err);
    }
};
