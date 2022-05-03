const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Category extends Model {};

Category.init({
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
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        allowNull: true,
        set(value) {
            this.setDataValue('publishedAt', this.status === 'published' ? value || new Date() : null);
        }
    },
}, {
    sequelize,
    modelName: 'category',
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

Category.sync();

module.exports = Category;