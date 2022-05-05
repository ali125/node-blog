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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
let Tag = class Tag extends sequelize_typescript_1.Model {
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
], Tag.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
    }),
    __metadata("design:type", String)
], Tag.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Tag.prototype, "userId", void 0);
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
], Tag.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], Tag.prototype, "publishedAt", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], Tag.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], Tag.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], Tag.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Tag]),
    __metadata("design:returntype", void 0)
], Tag, "controlPublishedDate", null);
__decorate([
    sequelize_typescript_1.BeforeDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Tag]),
    __metadata("design:returntype", Promise)
], Tag, "controlDestroy", null);
Tag = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        modelName: 'tag',
        paranoid: true
    })
], Tag);
;
exports.default = Tag;
