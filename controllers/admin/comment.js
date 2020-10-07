const Comment = require('../../models/comment');

exports.getComments = async (req, res, next) => {
    try {
        const data = await Comment.find();
        return res.render("admin/comments/list", { data });
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};

exports.getComment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Comment.findById(id).populate('postId').populate('replies.userId');
        // return res.send(data);
        return res.render("admin/comments/single", { data });
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};

exports.saveReply = async (req, res, next) => {
    try {
        const id = req.params.id;
        const content = req.body.content;
        const comment = await Comment.findById(id);
        const body = {
            userId: req.user._id,
            content,
            createdAt: new Date()
        };
        comment.replies = [...comment.replies, body];
        await comment.save();
        return res.redirect("/admin/comments/"+id);
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
