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
        const post = new Post({
            title,
            content,
            userId: req.user._id
        });
        await post.save();
        res.redirect('/admin/posts')
    } catch(err) {
        console.log('err', err);
    }
};
