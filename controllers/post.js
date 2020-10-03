const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const data = await Post.find().populate('userId').exec();
        res.render('posts/list', {data});
    } catch(err) {
        console.log('err', err);
    }
};
exports.getPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Post.findById(id).populate('userId').exec();
        // res.send(data);
        res.render('posts/single', {data});
    } catch(err) {
        console.log('err', err);
    }
};

exports.saveComment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const email = req.body.email;
        const content = req.body.content;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.session.errorsMessage = errors.array();
            req.session.formData = {
                name,
                email,
                content
            };
            res.redirect('/posts/'+id);
        }
        const body = {
            name,
            email,
            content,
            createdAt: new Date()
        };
        const post = await Post.findById(id);
        post.comments = [...post.comments, body];
        await post.save();
        res.redirect('/posts/'+id);
    } catch(err) {
        console.log('err', err);
    }
};
