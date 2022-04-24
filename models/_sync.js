const sequelize = require('../config/db');
const User = require('./user');
const Post = require('./post');
const Category = require('./category');

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

// Category.sync({ force: true }).then(() => {
//     console.log('DB Synced');
// });
