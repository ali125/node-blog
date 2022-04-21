const sequelize = require('../config/db');
const User = require('./user');
const Post = require('./post');

User.hasMany(Post, { 
    foreignKey: 'userId'
});
Post.belongsTo(User, { 
    foreignKey: 'userId'
});

sequelize.sync({ force: true }).then(() => {
    console.log('DB Synced');
});
