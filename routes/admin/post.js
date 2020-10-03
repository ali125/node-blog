const express = require('express');
const multer = require('multer');
const crypto = require('crypto-js');
const {postValidation} = require('../../middleware/validations');
const router = express.Router();
const adminPostController = require('../../controllers/admin/post');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        const ind = file.originalname.lastIndexOf('.');
        const extension = file.originalname.substr(ind);
        const filename = crypto.SHA1(new Date().getTime()) + extension;
        cb(null, filename)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
        cb(new Error('Please select an image'))
    }
};

const upload = multer({
    storage,
    fileFilter
}).single('file');

router.get('/', adminPostController.getPosts);
router.get('/add', adminPostController.addPost);
router.post('/add', upload, postValidation, adminPostController.savePost);
router.get('/:id/edit', adminPostController.editPost);
router.post('/:id/edit', upload, postValidation, adminPostController.updatePost);
router.get('/:id/delete', adminPostController.deletePost);

router.get('/file/:id', adminPostController.createGetFile);

module.exports = router;
