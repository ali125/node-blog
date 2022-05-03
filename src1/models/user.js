const bcrypt = require('bcryptjs');
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db');
const { truncateText } = require('../utils/string');

class User extends Model {
    static async findByCredentials(email, password) {
        try {
            const user = await User.findOne({
                where: { email }
            });
            if(!user) {
                throw 'Email or password is wrong';
            }
            const hashPassword = user.getDataValue('password');
            const isMatch = bcrypt.compareSync(password, hashPassword);
            if(!isMatch) {
                throw 'Email or password is wrong';
            }
            return user;
        } catch (e) {
            throw new Error(e);
        }
    };
    static async checkPassword(userId, currentPassowrd) {
        try {
            const user = await User.findOne({
                where: { id: userId }
            });
            if(!user) {
                throw 'Unable to check authentication';
            }
            const hashPassword = user.getDataValue('password');
            const isMatch = bcrypt.compareSync(currentPassowrd, hashPassword);
            if(!isMatch) {
                throw 'Current password wrong';
            }
            return user;
        } catch (e) {
            throw new Error(e);
        }
    }
}

User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        },
        get() {
            return;
        },
        set(value) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash)
        },
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    birthDate: {
        type: DataTypes.DATE,
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: null,
        validate: {
            isIn: [['male', 'female']],
        }
    },
    about: {
        type: DataTypes.TEXT,
    },
    shortAbout: {
        type: DataTypes.VIRTUAL,
        get() {
            return truncateText(this.about || '', 80);
        },
        set(value) {
            throw new Error('Do not try to set the `shortAbout` value!');
        }
    },
    verifiedEmail: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    },
    verifiedPhoneNumber: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'blocked']]
        },
    },
    blockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        set(value = null) {
            this.setDataValue('blockedAt', value || (this.status === 'blocked' ? new Date() : null))
        },
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
        set(value = null) {
            this.setDataValue('resetTokenExpiration', value || (this.resetToken ? Date.now() + 3600000 : null))
        },
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: true,
    paranoid: true,
    logging: false,
    hooks: {
        beforeDestroy: async (instance) => {
            await instance.update({ email: new Date().getTime() + '_del_' + instance.email })
        }
    }
});

User.sync();

module.exports = User;