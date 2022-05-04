import { Model, DataTypes, CreationOptional } from 'sequelize';
import { BeforeCreate, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt } from 'sequelize-typescript';
import { timeSince } from '../utils/date';
import { truncateText } from '../utils/string';

@Table({
    timestamps: true,
    modelName: 'comment',
    paranoid: true
})
class Comment extends Model {
    @Column
    userId?: number;
    
    @Column
    postId?: number;

    @Column
    parentId?: number;

    @Column
    content?: string;

    @Column({
        type: DataTypes.VIRTUAL,
        get(this: Comment) {
            return truncateText(this.content || '', 100);
        },
        set(this: Comment, value) {
            throw new Error('Do not try to set the `shortContent` value!');
        }
    })
    shortContent?: string;

    @Column({
        type: DataTypes.VIRTUAL,
        get(this: Comment) {
            return timeSince(this.createdAt);
        },
        set(this: Comment) {
            throw new Error('Do not try to set the `dateSince` value!');
        }
    })
    dateSince?: Storage;
    
    @Default('active')
    @Column
    status?: 'active' | 'blocked' | 'reported';
    
    @Column({
        type: DataTypes.DATE,
    })
    blockedAt?: Date;

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
    static controlPublishedDate(instance: Comment) {
        if (instance.getDataValue('status') === 'blocked') {
            const val = instance.getDataValue('blockedAt') || new Date();
            instance.setDataValue('blockedAt', val);
        } else {
            instance.setDataValue('blockedAt', null);
        }
    }
};

export default Comment;