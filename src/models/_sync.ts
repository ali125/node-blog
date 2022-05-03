import sequelize from '../config/db';
import User from './user';
import Post from './post';
import Category from './category';
import Tag from './tag';
import Comment from './comment';

User.hasMany(Post, { 
    foreignKey: 'userId'
});
Post.belongsTo(User, { 
    foreignKey: 'userId'
});


User.hasMany(Category, { 
    foreignKey: 'userId'
});
Category.belongsTo(User, { 
    foreignKey: 'userId'
});

Category.hasMany(Post, {
    foreignKey: 'categoryId'
})
Post.belongsTo(Category, { 
    foreignKey: 'categoryId'
});

Category.belongsTo(Category, {
    as: 'parent',
});


User.hasMany(Tag, { 
    foreignKey: 'userId'
});
Tag.belongsTo(User, { 
    foreignKey: 'userId'
});
Post.belongsToMany(Tag, {
    through: 'post_tag'
})
Tag.belongsToMany(Post, { 
    through: 'post_tag'
});


User.hasMany(Comment, {
    foreignKey: 'userId',
});
Post.hasMany(Comment, {
    foreignKey: 'postId',
});
Comment.belongsTo(User, {
    foreignKey: 'userId',
});
Comment.belongsTo(Post, {
    foreignKey: 'postId',
});
Comment.hasMany(Comment, {
    foreignKey: 'parentId',
    as: 'replies'
});
Comment.belongsTo(Comment, {
    foreignKey: 'parentId'
});

// Post.sync({ force: true }).then(() => {
//     console.log('DB Synced';
// });
// sequelize.sync({ alter: true }).then(() => {
//     console.log('DB Synced';
// });
