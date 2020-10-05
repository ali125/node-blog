const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

exports.fileDelete = (filePath) => {
    fs.unlink(filePath, err => {
        if(err) throw new Error(err);
    })
};

exports.uploadImageFile = (fileName = 'file', path = "images/") => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path)
        },
        filename: (req, file, cb) => {
            const ind = file.originalname.lastIndexOf('.');
            const extension = file.originalname.substr(ind);
            const filename = uuidv4() + extension;
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

    return multer({
        storage,
        fileFilter
    }).single(fileName);
};
