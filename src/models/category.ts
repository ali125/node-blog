import { DataTypes, CreationOptional } from 'sequelize';
import { Model, BeforeCreate, BeforeDestroy, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Post from './post';
import User from './user';

@Table({
    timestamps: true,
    modelName: 'category',
    paranoid: true
})
class Category extends Model {
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
        allowNull: true,
    })
    parentId?: number;

    @BelongsTo(() => Category, { as: 'parent' })
    parent?: Category

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

    @HasMany(() => Post)
    posts?: Post[]

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

    @BeforeCreate
    @BeforeUpdate
    static controlPublishedDate(instance: Category) {
        if (instance.getDataValue('status') === 'published') {
            const val = instance.getDataValue('publishedAt') || new Date();
            instance.setDataValue('publishedAt', val);
        } else {
            instance.setDataValue('publishedAt', null);
        }
    }

    @BeforeDestroy
    static async controlDestroy(instance: Category) {
        await instance.update({ slug: instance.slug + '_del_' + new Date().getTime() })
    }
};

export default Category;