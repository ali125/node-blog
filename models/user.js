const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
    imageUrl: {
        type: String
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.set('toJSON', { virtuals: true });
userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model("User", userSchema);
