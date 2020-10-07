const mongoose = require('mongoose');
const stringHelper = require('../util/string');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }],
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
});

postSchema.set('toJSON', { virtuals: true });
postSchema.virtual('short_content').get(function() {
    return stringHelper.truncateText(this.content);
});

postSchema.methods.addComment = function(comment) {
    this.comments = [...this.comments, comment ];
    return this.save();
};

module.exports = mongoose.model('Post', postSchema);
