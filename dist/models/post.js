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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const string_1 = require("../utils/string");
const category_1 = __importDefault(require("./category"));
const post_tag_1 = __importDefault(require("./post_tag"));
const tag_1 = __importDefault(require("./tag"));
const user_1 = __importDefault(require("./user"));
let Post = class Post extends sequelize_typescript_1.Model {
    static controlPublishedDate(instance) {
        if (instance.getDataValue('status') === 'published') {
            const val = instance.getDataValue('publishedAt') || new Date();
            instance.setDataValue('publishedAt', val);
        }
        else {
            instance.setDataValue('publishedAt', null);
        }
    }
    static async controlDestroy(instance) {
        await instance.update({ slug: instance.slug + '_del_' + new Date().getTime() });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        }
    }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
    }),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
    }),
    __metadata("design:type", String)
], Post.prototype, "image", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
    }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
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
], Post.prototype, "shortContent", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Post.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Post.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => category_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
    }),
    __metadata("design:type", Number)
], Post.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => category_1.default),
    __metadata("design:type", category_1.default)
], Post.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('open'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open',
        validate: {
            isIn: [['open', 'close']]
        },
    }),
    __metadata("design:type", String)
], Post.prototype, "commentStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], Post.prototype, "commentCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('published'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'published',
        validate: {
            isIn: [['draft', 'published']]
        },
    }),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], Post.prototype, "publishedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.status === 'published' && this.publishedAt && new Date(this.publishedAt).getTime() < new Date().getTime();
        }
    }),
    __metadata("design:type", String)
], Post.prototype, "isPublished", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], Post.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], Post.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], Post.prototype, "deletedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => tag_1.default, () => post_tag_1.default),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post]),
    __metadata("design:returntype", void 0)
], Post, "controlPublishedDate", null);
__decorate([
    sequelize_typescript_1.BeforeDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post]),
    __metadata("design:returntype", Promise)
], Post, "controlDestroy", null);
Post = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        modelName: 'post',
        paranoid: true
    })
], Post);
exports.default = Post;
