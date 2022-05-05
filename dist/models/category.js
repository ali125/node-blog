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
var Category_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const post_1 = __importDefault(require("./post"));
const user_1 = __importDefault(require("./user"));
let Category = Category_1 = class Category extends sequelize_typescript_1.Model {
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
], Category.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
    }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Category.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Category.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Category_1),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Category.prototype, "parentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Category_1, { as: 'parent' }),
    __metadata("design:type", Category)
], Category.prototype, "parent", void 0);
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
], Category.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], Category.prototype, "publishedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => post_1.default),
    __metadata("design:type", Array)
], Category.prototype, "posts", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], Category.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], Category.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], Category.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Category]),
    __metadata("design:returntype", void 0)
], Category, "controlPublishedDate", null);
__decorate([
    sequelize_typescript_1.BeforeDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Category]),
    __metadata("design:returntype", Promise)
], Category, "controlDestroy", null);
Category = Category_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        modelName: 'category',
        paranoid: true
    })
], Category);
;
exports.default = Category;
