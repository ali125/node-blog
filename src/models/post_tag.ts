import { CreationOptional } from 'sequelize';
import { Model, Column, CreatedAt, Table, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import Post from './post';
import Tag from './tag';

@Table({
    timestamps: true,
    modelName: 'post_tag',
    paranoid: true
})
class PostTag extends Model {
    id?: number;

    @ForeignKey(() => Post)
    @Column
    postId?: number;
  
    @ForeignKey(() => Tag)
    @Column
    tagId?: number;

    // timestamps!
    // createdAt can be undefined during creation
    @CreatedAt
    createdAt?: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    @UpdatedAt
    updatedAt?: CreationOptional<Date>;
};

export default PostTag;