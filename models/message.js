const mongoose = require('mongoose');
const stringHelper = require('../util/string');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    replies: [
        {
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
        }
    ],
    createdAt: {
        type: Date,
        required: true
    }
});

messageSchema.set('toJSON', { virtuals: true });
messageSchema.virtual('short_content').get(function() {
    return stringHelper.truncateText(this.content);
});

module.exports = mongoose.model('Message', messageSchema);
