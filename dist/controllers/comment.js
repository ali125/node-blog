"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const save = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Please authenticate.', status: 401 });
        const postId = req.params.postId;
        const content = req.body.content;
        const parentId = req.body.commentId || null;
        const comment = await req.user.createComment({
            postId,
            content,
            parentId
        });
        res.status(201).json({ message: 'Comment created successfully!', status: 201, comment });
    }
    catch (e) {
        next(e);
    }
};
exports.save = save;
