const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getPosts = async (req, res, next) => {
    try {
        const data = await Post.find().sort([['createdAt', -1]]).populate('userId').exec();
        res.render('posts/list', {data});
    } catch(err) {
        console.log('err', err);
    }
};
exports.getPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Post.findById(id).populate('userId').populate('comments').exec();
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
            postId: id,
            createdAt: new Date()
        };
        const comment = await Comment(body);
        await comment.save();
        const post = await Post.findById(id);
        await post.addComment(comment);
        res.redirect('/posts/'+id);
    } catch(err) {
        console.log('err', err);
    }
};
