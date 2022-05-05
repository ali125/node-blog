import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import User from '../models/user';
import Category from '../models/category';
import Tag from '../models/tag';
import Post from '../models/post';
import Comment from '../models/comment';
import PostTag from '../models/post_tag';
// import { Dialect, Options, Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT as Dialect,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    database: process.env.DB_DATABASE as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
});

sequelize.addModels([User, Category, Tag, Post, Comment, PostTag]);
// sequelize.addModels([__dirname + '../models/*.ts']);

sequelize.authenticate().then(() => {
    console.log('=== Connection successful! ===');
}).catch((err) => {
    console.log('=== Error conneting to database! === ');
    console.log(err);
});

export default sequelize;