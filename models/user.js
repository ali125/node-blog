const bcrypt = require('bcryptjs');
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db');

class User extends Model {}

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
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: false
        }
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
    logging: false
});

User.sync();

module.exports = User;