import { Model, DataTypes } from 'sequelize';
import { BelongsTo, Column, Default, ForeignKey, Table } from 'sequelize-typescript';
import sequelize from '../config/db';
import User from './user';

@Table({
    timestamps: true,
    modelName: 'tag',
    paranoid: true
})
class Tag extends Model {
    @Column
    title?: string;

    @Column({
        unique: 'compositeIndex'
    })
    slug?: string;
    
    // @ForeignKey(() => User)
    @Column
    userId?: number;
    
    @Default('published')
    @Column
    status?: 'draft' | 'published';
    
    @Column({
        type: DataTypes.DATE,
    })
    publishedAt?: Date;
    
};

Tag.init({
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
    modelName: 'tag',
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

Tag.sync();

export default Tag;