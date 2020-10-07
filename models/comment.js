const mongoose = require('mongoose');
const stringHelper = require('../util/string');

const Schema = mongoose.Schema;

const replySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});
replySchema.set('toJSON', { virtuals: true });
replySchema.virtual('short_content').get(function() {
    return stringHelper.truncateText(this.content);
});


const commentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        required: true
    }
});
commentSchema.set('toJSON', { virtuals: true });
commentSchema.virtual('short_content').get(function() {
    return stringHelper.truncateText(this.content);
});

module.exports = mongoose.model('Comment', commentSchema);
