const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { timeSince } = require('../utils/date');
const { truncateText } = require('../utils/string');

class Comment extends Model {};

Comment.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    shortContent: {
        type: DataTypes.VIRTUAL,
        get() {
            return truncateText(this.content, 80);
        },
        set() {
            throw new Error('Do not try to set the `shortContent` value!');
        }
    },
    dateSince: {
        type: DataTypes.VIRTUAL,
        get() {
            return timeSince(this.createdAt);
        },
        set() {
            throw new Error('Do not try to set the `dateSince` value!');
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: ['active', 'blocked', 'reported'],
        }
    },
    blockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        set(value = null) {
            this.setDataValue('blockedAt', value || (this.status === 'blocked' ? new Date() : null))
        },
    },
}, {
    sequelize,
    modelName: 'comment',
    timestamps: true,
    paranoid: true,
    logging: false,
});

Comment.sync();

module.exports = Comment;