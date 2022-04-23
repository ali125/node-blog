const sequelize = require('../config/db');
const { DataTypes, Model } = require('sequelize');
const { truncateText, getUniqueSlug } = require('../utils/string');

class Post extends Model {}

Post.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
        // async set(value = '') {
        //     const slugValue = await getUniqueSlug(Post, this.title, value);
        //     console.log('========================= slugValue', slugValue);
        //     this.setDataValue('slug', slugValue);
        // }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        }
    },
    content: {
        type: DataTypes.TEXT,
    },
    shortContent: {
        type: DataTypes.VIRTUAL,
        get() {
            return truncateText(this.content, 80);
        },
        set(value) {
            throw new Error('Do not try to set the `summary` value!');
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    commentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open',
        validate: {
            isIn: [['open', 'close']]
        },
    },
    commentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'draft',
        validate: {
            isIn: [['draft', 'published']]
        },
        
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        set(value = null) {
            this.setDataValue('publishedAt', value || (this.status === 'published' ? new Date() : null))
        },
    },
}, {
    sequelize,
    modelName: 'post',
    timestamps: true,
    paranoid: true,
    logging: false
});

Post.sync();

module.exports = Post;