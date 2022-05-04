import { Model, DataTypes, CreationOptional } from 'sequelize';
import { BeforeCreate, BeforeDestroy, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt } from 'sequelize-typescript';

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