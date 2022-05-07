import { DataTypes, CreationOptional } from 'sequelize';
import { Model, BeforeCreate, BeforeDestroy, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Post from './post';
import PostTag from './post_tag';
import User from './user';

@Table({
    timestamps: true,
    modelName: 'tag',
    paranoid: true
})
class Tag extends Model {
    id?: number;

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
    
    @ForeignKey(() => User)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: false,
    })
    userId?: number;

    @BelongsTo(() => User)
    user?: User
    
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
    posts?: Post[]

    @BeforeCreate
    @BeforeUpdate
    static controlPublishedDate(instance: Tag) {
        if (instance.getDataValue('status') === 'published') {
            const val = instance.getDataValue('publishedAt') || new Date();
            instance.setDataValue('publishedAt', val);
        } else {
            instance.setDataValue('publishedAt', null);
        }
    }

    @BeforeDestroy
    static async controlDestroy(instance: Tag) {
        await instance.update({ slug: instance.slug + '_del_' + new Date().getTime() })
    }
};

export default Tag;