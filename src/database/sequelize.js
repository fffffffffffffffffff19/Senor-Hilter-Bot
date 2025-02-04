const { Sequelize } = require('sequelize');
const { resolve } = require('node:path');

module.exports = new Sequelize({
    dialect: 'sqlite',
    storage: resolve(__dirname, 'database.sqlite'),
    logging: false,
});
