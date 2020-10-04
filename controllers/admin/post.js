const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { validationResult } = require('express-validator');
const Post = require('../../models/post');
const fileHelper = require('../../util/file');

const ITEMS_PER_PAGE = 5;

exports.getPosts = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const totalItems = await Post.find().countDocuments();
        const data = await Post.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).populate('userId').exec();
        res.render('admin/posts/list', {
            headTitle: 'Posts List',
            data,
            currentPage: page,
            prevPage: page > 1 ? page - 1 : null,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
            nextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            firstPage: 1
        });
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
exports.addPost = async (req, res, next) => {
    try {
        res.render('admin/posts/form');
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
exports.savePost = async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const image = req.file;
        if(!image) {
            req.session.errorsMessage = 'Please add an image';
            req.session.formData = {
                title,
                content
            };
            return res.redirect('/admin/posts/add');
        }
        const imageUrl = image.path;
        const body = {
            title,
            content,
            imageUrl,
            userId: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const errors = validationResult(req);
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
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
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
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
exports.updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const content = req.body.content;
        const image = req.file;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.session.errorsMessage = errors.array();
            req.session.formData = {
                title,
                content
            };
            return res.redirect(`/admin/posts/${id}/edit`);
        }
        const post = await Post.findById(id);
        post.title = title;
        post.content = content;
        post.updatedAt = new Date();
        // return res.send(post)
        if(image) {
            fileHelper.fileDelete(post.imageUrl);
            post.imageUrl = image.path;
        }
        await post.save();
        res.redirect('/admin/posts')
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);
        if(post.imageUrl) fileHelper.fileDelete(post.imageUrl);
        await Post.deleteOne({ _id: id });
        res.redirect('/admin/posts')
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};


exports.getFile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const fileName = 'pack.pdf';
        const filePath = path.join('data', 'file', fileName);
        // fs.readFile(filePath, (err, data) => {
        //    if(err) {
        //        return next(err);
        //    }
        //    res.setHeader('Content-Type', 'application/pdf');
        //    res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"'); // Open in browser
        //    // res.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '"'); // Download
        //    res.send(data);
        // }); // Small file is fine - not for big files
        const file = fs.createReadStream(filePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"'); // Open in browser
        file.pipe(res);
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};

exports.createGetFile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const fileName = `pack-${id}.pdf`;
        const filePath = path.join('data', 'file', fileName);

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"'); // Open in browser
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Invoice', {
            underline: true
        });

        pdfDoc.fontSize(16).text('-----------------------------');

        pdfDoc.end();
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
