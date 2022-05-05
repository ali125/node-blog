import { DataTypes, CreationOptional } from 'sequelize';
import { Model, BeforeCreate, BeforeUpdate, Column, CreatedAt, Default, DeletedAt, Table, UpdatedAt, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { timeSince } from '../utils/date';
import { truncateText } from '../utils/string';
import Post from './post';
import User from './user';

@Table({
    timestamps: true,
    modelName: 'comment',
    paranoid: true
})
class Comment extends Model {
    id?: number

    @ForeignKey(() => User)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: false
    })
    userId?: number;

    @BelongsTo(() => User)
    user?: User
    
    @ForeignKey(() => Post)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: false,
    })
    postId?: number;
    
    @BelongsTo(() => Post)
    post?: Post

    @ForeignKey(() => Comment)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: true,
    })
    parentId?: number;

    @HasMany(() => Comment, { as: 'replies' })
    replies?: Comment[]

    @BelongsTo(() => Comment, )
    parent?: Comment

    @Column({
        type: DataTypes.TEXT,
        allowNull: false,
    })
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
    dateSince?: string;
    
    @Default('active')
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'blocked', 'reported']],
        },
    })
    status?: 'active' | 'blocked' | 'reported';
    
    @Column({
        type: DataTypes.DATE,
        allowNull: true,
    })
    blockedAt?: Date;

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