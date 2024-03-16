import { Sequelize } from 'sequelize';

const { 
    DB_NAME, 
    DB_USER, 
    DB_PASS,
    DB_HOST: host, 
    DB_PORT: port, 
    DB_DIALECT: dialect
} = process.env;

const sequelize = new Sequelize(
    DB_NAME, DB_USER, DB_PASS, 
    { host, port, dialect }
);

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;
