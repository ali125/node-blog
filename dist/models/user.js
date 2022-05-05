"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const string_1 = require("../utils/string");
const post_1 = __importDefault(require("./post"));
const comment_1 = __importDefault(require("./comment"));
const tag_1 = __importDefault(require("./tag"));
const category_1 = __importDefault(require("./category"));
let User = User_1 = class User extends sequelize_typescript_1.Model {
    static async findByCredentials(email, password) {
        try {
            const user = await User_1.findOne({
                where: { email }
            });
            if (!user) {
                throw 'Email or password is wrong';
            }
            const hashPassword = user.getDataValue('password');
            const isMatch = bcryptjs_1.default.compareSync(password, hashPassword);
            if (!isMatch) {
                throw 'Email or password is wrong';
            }
            return user;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    ;
    static async checkPassword(userId, currentPassowrd) {
        try {
            const user = await User_1.findOne({
                where: { id: userId }
            });
            if (!user) {
                throw 'Unable to check authentication';
            }
            const hashPassword = user.getDataValue('password');
            const isMatch = bcryptjs_1.default.compareSync(currentPassowrd, hashPassword);
            if (!isMatch) {
                throw 'Current password wrong';
            }
            return user;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    static async controlDestroy(instance) {
        await instance.update({ email: new Date().getTime() + '_del_' + instance.email });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
        validate: {
            isEmail: true,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        },
        get() {
            return;
        },
        set(value) {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(value, salt);
            this.setDataValue('password', hash);
        },
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "avatar", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
    }),
    __metadata("design:type", Object)
], User.prototype, "birthDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        validate: {
            isIn: [['male', 'female']],
        }
    }),
    __metadata("design:type", Object)
], User.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
    }),
    __metadata("design:type", Object)
], User.prototype, "about", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return (0, string_1.truncateText)(this.about || '', 80);
        },
        set(value) {
            throw new Error('Do not try to set the `shortAbout` value!');
        }
    }),
    __metadata("design:type", Object)
], User.prototype, "shortAbout", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", Number)
], User.prototype, "verifiedEmail", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", Number)
], User.prototype, "verifiedPhoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('active'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'blocked']]
        },
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        set(value = null) {
            this.setDataValue('blockedAt', value || (this.status === 'blocked' ? new Date() : null));
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "blockedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "resetToken", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        set(value = null) {
            this.setDataValue('resetTokenExpiration', value || (this.resetToken ? new Date(Date.now() + 3600000) : null));
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "resetTokenExpiration", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => post_1.default),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => category_1.default),
    __metadata("design:type", Array)
], User.prototype, "categories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => tag_1.default),
    __metadata("design:type", Array)
], User.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => comment_1.default),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    sequelize_typescript_1.BeforeDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "controlDestroy", null);
User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        modelName: 'user',
        paranoid: true
    })
], User);
exports.default = User;
