import bcrypt from 'bcryptjs';
import { Model, CreatedAt, DeletedAt, Table, UpdatedAt, Column, AllowNull, Default, BeforeDestroy, HasMany } from 'sequelize-typescript';
import { DataTypes, CreationOptional, HasManyCreateAssociationMixin, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin } from 'sequelize';
import { truncateText } from '../utils/string';
import Post from './post';
import Comment from './comment';
import Tag from './tag';
import Category from './category';

@Table({
    timestamps: true,
    modelName: 'user',
    paranoid: true
})
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id?: number;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    })
    firstName?: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    })
    lastName?: string;

    @Column({
        type: DataTypes.VIRTUAL,
        get(this: User) {
            return `${this.firstName} ${this.lastName}`;
        },
        set(this: User, value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
        
    })
    readonly fullName?: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
        validate: {
            isEmail: true,
        },
    })
    email?: string;

    @AllowNull
    @Column({
        type: DataTypes.STRING,
        allowNull: true,
    })
    phoneNumber?: string | null;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        },
        get(this: User) {
            return;
        },
        set(this: User, value: string) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash)
        },
    })
    password?: string;

    @AllowNull
    @Column({
        type: DataTypes.STRING,
        allowNull: true,
    })
    avatar?: string | null;

    @AllowNull
    @Column({
        type: DataTypes.DATE,
    })
    birthDate?: Date | null;

    @AllowNull
    @Column({
        type: DataTypes.STRING,
        defaultValue: null,
        validate: {
            isIn: [['male', 'female']],
        }
    })
    gender?: 'male' | 'female' | null;

    @AllowNull
    @Column({
        type: DataTypes.TEXT,
    })
    about?: string | null;
    
    
    @AllowNull
    @Column({
        type: DataTypes.VIRTUAL,
        get(this: User) {
            return truncateText(this.about || '', 80);
        },
        set(this: User, value) {
            throw new Error('Do not try to set the `shortAbout` value!');
        }
    })
    shortAbout?: string | null;

    @Default(0)
    @Column({
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    })
    verifiedEmail?: number;

    @Default(0)
    @Column({
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    })
    verifiedPhoneNumber?: number;

    @Default('client')
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'client',
        validate: {
            isIn: [['client', 'owner', 'admin']]
        },
    })
    role?: 'client' | 'owner' | 'admin';

    @Column({
        type: DataTypes.STRING
    })
    facebookUrl?: string;

    @Column({
        type: DataTypes.STRING
    })
    instagramUrl?: string;

    @Column({
        type: DataTypes.STRING
    })
    twitterUrl?: string;

    @Column({
        type: DataTypes.STRING
    })
    linkedInUrl?: string;

    @Column({
        type: DataTypes.STRING
    })
    githubUrl?: string;

    @Column({
        type: DataTypes.STRING
    })
    youtubeUrl?: string;

    @Default('active')
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'blocked']]
        },
    })
    status?: 'active' | 'blocked';

    @AllowNull
    @Column({
        type: DataTypes.DATE,
        allowNull: true,
        set(this: User, value: Date | null = null) {
            this.setDataValue('blockedAt', value || (this.status === 'blocked' ? new Date() : null))
        },
    })
    blockedAt?: Date | null;

    @AllowNull
    @Column({
        type: DataTypes.STRING,
        allowNull: true,
    })
    resetToken?: string | null;

    @AllowNull
    @Column({
        type: DataTypes.DATE,
        allowNull: true,
        set(this: User, value: Date | null = null) {
            this.setDataValue('resetTokenExpiration', value || (this.resetToken ? new Date(Date.now() + 3600000) : null))
        },
    })
    resetTokenExpiration?: Date | null;
    
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

    @HasMany(() => Post)
    posts?: Post[]

    @HasMany(() => Category)
    categories?: Category[]
    
    @HasMany(() => Tag)
    tags?: Tag[]
    
    @HasMany(() => Comment)
    comments?: Comment[]
   
    static async findByCredentials(email: string, password: string) {
        try {
            const user = await User.findOne({
                where: { email }
            });
            if(!user) {
                throw 'Email or password is wrong';
            }
            const hashPassword = user.getDataValue('password') as string;
            const isMatch = bcrypt.compareSync(password, hashPassword);
            if(!isMatch) {
                throw 'Email or password is wrong';
            }
            return user;
        } catch (e: any) {
            throw new Error(e);
        }
    };

    static async checkPassword(userId:  number, currentPassowrd: string) {
        try {
            const user = await User.findOne({
                where: { id: userId }
            });
            if(!user) {
                throw 'Unable to check authentication';
            }
            const hashPassword = user.getDataValue('password') as string;
            const isMatch = bcrypt.compareSync(currentPassowrd, hashPassword);
            if(!isMatch) {
                throw 'Current password wrong';
            }
            return user;
        } catch (e: any) {
            throw new Error(e);
        }
    }

    @BeforeDestroy
    static async controlDestroy(instance: User) {
        await instance.update({ email: new Date().getTime() + '_del_' + instance.email })
    }

    declare createComment: HasManyCreateAssociationMixin<Comment, 'userId'>;

    declare createPost: HasManyCreateAssociationMixin<Post, 'userId'>;
    declare getPosts: HasManyGetAssociationsMixin<Post>;

    declare createTag: HasManyCreateAssociationMixin<Tag, 'userId'>;

    declare createCategory: HasManyCreateAssociationMixin<Category, 'userId'>;
}

export default User;