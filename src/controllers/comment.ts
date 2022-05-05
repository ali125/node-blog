import { RequestHandler } from "express";

export const save: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Please authenticate.', status: 401 });

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