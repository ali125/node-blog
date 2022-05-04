import bcrypt from 'bcryptjs';
import { CreatedAt, DeletedAt, Table, UpdatedAt, PrimaryKey, Column, AllowNull, Default, AutoIncrement, HasMany, BeforeDestroy } from 'sequelize-typescript';
import { Model, DataTypes, CreationOptional } from 'sequelize';
import { truncateText } from '../utils/string';

@Table({
    timestamps: true,
    modelName: 'user',
    paranoid: true
})
class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id?: number;

    @Column
    firstName?: string;

    @Column
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

    @Column
    email?: string;

    @Column
    @AllowNull
    phoneNumber?: string | null;

    @Column({
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

    @Column
    @AllowNull
    avatar?: string | null;

    @Column
    @AllowNull
    birthDate?: Date | null;

    @Column
    @AllowNull
    gender?: 'male' | 'female' | null;

    @Column
    @AllowNull
    about?: string | null;
    
    @Column({
        type: DataTypes.VIRTUAL,
        get(this: User) {
            return truncateText(this.about || '', 80);
        },
        set(this: User, value) {
            throw new Error('Do not try to set the `shortAbout` value!');
        }
    })
    @AllowNull
    shortAbout?: string | null;

    @Default(0)
    @Column
    verifiedEmail?: number;

    @Default(0)
    @Column
    verifiedPhoneNumber?: number;

    @Default('active')
    @Column
    status?: 'active' | 'blocked';

    @AllowNull
    @Column
    blockedAt?: Date | null;

    @AllowNull
    @Column
    resetToken?: string | null;

    @AllowNull
    @Column
    resetTokenExpiration?: string | null;
    
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

    // @HasMany(() => Tag)
    // tags?: Tag[]
   
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
}

export default User;