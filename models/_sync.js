const sequelize = require('../config/db');
const User = require('./user');
const Post = require('./post');
const Category = require('./category');
const Tag = require('./tag');

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

// Post.sync({ force: true }).then(() => {
//     console.log('DB Synced');
// });
// sequelize.sync({ force: true }).then(() => {
//     console.log('DB Synced');
// });
