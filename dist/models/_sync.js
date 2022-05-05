"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
// User.hasMany(Post, { 
//     foreignKey: 'userId'
// });
// Post.belongsTo(User, { 
//     foreignKey: 'userId'
// });
// User.hasMany(Category, { 
//     foreignKey: 'userId'
// });
// Category.belongsTo(User, { 
//     foreignKey: 'userId'
// });
// Category.hasMany(Post, {
//     foreignKey: 'categoryId'
// })
// Post.belongsTo(Category, { 
//     foreignKey: 'categoryId'
// });
// Category.belongsTo(Category, {
//     as: 'parent',
// });
// User.hasMany(Tag, { 
//     foreignKey: 'userId'
// });
// Tag.belongsTo(User, { 
//     foreignKey: 'userId'
// });
// Post.belongsToMany(Tag, {
//     through: 'post_tag'
// })
// Tag.belongsToMany(Post, { 
//     through: 'post_tag'
// });
// User.hasMany(Comment, {
//     foreignKey: 'userId',
// });
// Post.hasMany(Comment, {
//     foreignKey: 'postId',
// });
// Comment.belongsTo(User, {
//     foreignKey: 'userId',
// });
// Comment.belongsTo(Post, {
//     foreignKey: 'postId',
// });
// Comment.hasMany(Comment, {
//     foreignKey: 'parentId',
//     as: 'replies'
// });
// Comment.belongsTo(Comment, {
//     foreignKey: 'parentId'
// });
// Post.sync({ force: true }).then(() => {
//     console.log('DB Synced';
// });
db_1.default.sync({ force: true }).then(() => {
    console.log('DB Synced');
});
