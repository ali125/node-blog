"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = __importDefault(require("../models/user"));
const category_1 = __importDefault(require("../models/category"));
const tag_1 = __importDefault(require("../models/tag"));
const post_1 = __importDefault(require("../models/post"));
const comment_1 = __importDefault(require("../models/comment"));
const post_tag_1 = __importDefault(require("../models/post_tag"));
// import { Dialect, Options, Sequelize } from 'sequelize';
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
sequelize.addModels([user_1.default, category_1.default, tag_1.default, post_1.default, comment_1.default, post_tag_1.default]);
// sequelize.addModels([__dirname + '../models/*.ts']);
sequelize.authenticate().then(() => {
    console.log('=== Connection successful! ===');
}).catch((err) => {
    console.log('=== Error conneting to database! === ');
    console.log(err);
});
exports.default = sequelize;
