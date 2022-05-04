import { Sequelize, Options } from 'sequelize';

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    models: [__dirname + '/**/*.model.ts']
} as Options);

sequelize.authenticate().then(() => {
    console.log('=== Connection successful! ===');
}).catch((err) => {
    console.log('=== Error conneting to database! === ');
    console.log(err);
});

export default sequelize;