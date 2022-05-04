import { CreationOptional, DataTypes, Model } from 'sequelize';
import { AllowNull, BeforeCreate, BeforeDestroy, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt } from 'sequelize-typescript';

import { truncateText } from '../utils/string';

@Table({
    timestamps: true,
    modelName: 'post',
    paranoid: true
})
class Post extends Model {
    @Column
    title?: string;

    @Column({
        unique: 'compositeIndex'
    })
    slug?: string;

    @AllowNull
    @Column
    image?: string;

    @Column
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

    @Column
    categoryId?: number;

    @Default('open')
    @Column
    commentStatus?: 'open' | 'close';

    @Default(0)
    @Column
    commentCount?: number;

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
    @Column
    createdAt?: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    @UpdatedAt
    @Column
    updatedAt?: CreationOptional<Date>;
    // deletedAt can be undefined during creation
    @DeletedAt
    @Column
    deletedAt?: CreationOptional<Date>;

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
}

export default Post;