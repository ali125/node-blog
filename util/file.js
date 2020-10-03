const fs = require('fs');

exports.fileDelete = (filePath) => {
    fs.unlink(filePath, err => {
        if(err) throw new Error(err);
    })
};
