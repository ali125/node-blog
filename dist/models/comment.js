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
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const date_1 = require("../utils/date");
const string_1 = require("../utils/string");
const post_1 = __importDefault(require("./post"));
const user_1 = __importDefault(require("./user"));
let Comment = Comment_1 = class Comment extends sequelize_typescript_1.Model {
    static controlPublishedDate(instance) {
        if (instance.getDataValue('status') === 'blocked') {
            const val = instance.getDataValue('blockedAt') || new Date();
            instance.setDataValue('blockedAt', val);
        }
        else {
            instance.setDataValue('blockedAt', null);
        }
    }
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], Comment.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Comment.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => post_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Comment.prototype, "postId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => post_1.default),
    __metadata("design:type", post_1.default)
], Comment.prototype, "post", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Comment_1),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Comment.prototype, "parentId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1, { as: 'replies' }),
    __metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Comment_1),
    __metadata("design:type", Comment)
], Comment.prototype, "parent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return (0, string_1.truncateText)(this.content || '', 100);
        },
        set(value) {
            throw new Error('Do not try to set the `shortContent` value!');
        }
    }),
    __metadata("design:type", String)
], Comment.prototype, "shortContent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return (0, date_1.timeSince)(this.createdAt);
        },
        set() {
            throw new Error('Do not try to set the `dateSince` value!');
        }
    }),
    __metadata("design:type", String)
], Comment.prototype, "dateSince", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('active'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'blocked', 'reported']],
        },
    }),
    __metadata("design:type", String)
], Comment.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Comment.prototype, "blockedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], Comment.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], Comment.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Comment]),
    __metadata("design:returntype", void 0)
], Comment, "controlPublishedDate", null);
Comment = Comment_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        modelName: 'comment',
        paranoid: true
    })
], Comment);
;
exports.default = Comment;
