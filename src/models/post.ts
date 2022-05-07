import { BelongsToManyAddAssociationMixin, CreationOptional, DataTypes, HasManySetAssociationsMixin } from 'sequelize';
import { Model, AllowNull, BeforeCreate, BeforeDestroy, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';

import { truncateText } from '../utils/string';
import Category from './category';
import PostTag from './post_tag';
import Tag from './tag';
import User from './user';
import Comment from './comment';

@Table({
    timestamps: true,
    modelName: 'post',
    paranoid: true
})
class Post extends Model {
    id?: number

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        }
    })
    title?: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
    })
    slug?: string;

    @AllowNull
    @Column({
        type: DataTypes.TEXT,
    })
    image?: string;

    @Column({
        type: DataTypes.STRING,
    })
    content?: string;

    @Column({
        type: DataTypes.VIRTUAL,
        get(this: Post) {
            return truncateText(this.content || '', 100);
        },
        set(this: Post, value) {
            throw new Error('Do not try to set the `shortContent` value!');
        }
    })
    shortContent?: string;

    @ForeignKey(() => User)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: false,
    })
    userId?: number;

    @BelongsTo(() => User)
    user?: User

    @ForeignKey(() => Category)
    @Column({
        type: DataTypes.INTEGER,
    })
    categoryId?: number;

    @BelongsTo(() => Category)
    category?: Category
    
    @Default('open')
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open',
        validate: {
            isIn: [['open', 'close']]
        },
    })
    commentStatus?: 'open' | 'close';

    @Default(0)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    commentCount?: number;

    @Default('published')
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'published',
        validate: {
            isIn: [['draft', 'published']]
        },
    })
    status?: 'draft' | 'published';
    
    @Column({
        type: DataTypes.DATE,
        allowNull: true
    })
    publishedAt?: Date;

    @Column({
        type: DataTypes.VIRTUAL,
        get(this: Post) {
            return this.status === 'published' && this.publishedAt && new Date(this.publishedAt).getTime() < new Date().getTime();
        }
    })
    isPublished?: string;

    // timestamps!
    // createdAt can be undefined during creation
    @CreatedAt
    createdAt?: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    @UpdatedAt
    updatedAt?: CreationOptional<Date>;
    // deletedAt can be undefined during creation
    @DeletedAt
    deletedAt?: CreationOptional<Date>;

    @BelongsToMany(() => Tag, () => PostTag)
    tags?: Tag[]


    @HasMany(() => Comment)
    comments?: Comment[]

    @BeforeCreate
    @BeforeUpdate
    static controlPublishedDate(instance: Post) {
        if (instance.getDataValue('status') === 'published') {
            const val = instance.getDataValue('publishedAt') || new Date();
            instance.setDataValue('publishedAt', val);
        } else {
            instance.setDataValue('publishedAt', null);
        }
    }

    @BeforeDestroy
    static async controlDestroy(instance: Post) {
        await instance.update({ slug: instance.slug + '_del_' + new Date().getTime() })
    }

    declare setTags: BelongsToManyAddAssociationMixin<Tag, 'tagId'>;
    declare setCategory: HasManySetAssociationsMixin<Category, 'categoryId'>;
    
}

export default Post;