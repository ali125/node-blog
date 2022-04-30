
exports.save = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const content = req.body.content;
        const parentId = req.body.commentId || null;
        const comment = await req.user.createComment({
            postId,
            content,
            parentId
        });
        res.status(201).json({ message: 'Comment created successfully!', status: 201, comment });
    } catch (e) {
        next(e);
    }
};