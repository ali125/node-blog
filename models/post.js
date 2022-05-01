const sequelize = require('../config/db');
const { DataTypes, Model } = require('sequelize');
const { truncateText } = require('../utils/string');

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
    categoryId: {
        type: DataTypes.INTEGER,
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
    isPublished: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.status === 'published' && new Date(this.publishedAt).getTime() < new Date().getTime()
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'published',
        validate: {
            isIn: [['draft', 'published']]
        },
        
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'post',
    timestamps: true,
    paranoid: true,
    logging: false,
    hooks: {
        beforeCreate: (record, options) => {
            if (record.dataValues.status === 'published') {
                record.dataValues.publishedAt = record.dataValues.publishedAt || new Date();
            }
        },
        beforeUpdate: (record, options) => {
            if (record.dataValues.status === 'published') {
                record.dataValues.publishedAt = record.dataValues.publishedAt || new Date();
            } else {
                record.dataValues.publishedAt = null;
            }
        },
        beforeDestroy: async (instance) => {
            await instance.update({ slug: instance.slug + '_del_' + new Date().getTime() })
        }
    },
});

Post.sync();

module.exports = Post;