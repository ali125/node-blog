const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const data = await Post.find().populate('userId').exec();
        res.render('posts/list', {data});
    } catch(err) {
        console.log('err', err);
    }
};
exports.addPost = async (req, res, next) => {
    try {
        res.render('posts/add');
    } catch(err) {
        console.log('err', err);
    }
};

exports.savePost = async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const post = new Post({
            title,
            content,
            userId: req.user._id
        });
        await post.save();
        res.redirect('/posts')
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
