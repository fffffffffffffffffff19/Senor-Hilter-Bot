const { DataTypes } = require('sequelize');
const database = require('../sequelize');

module.exports = database.define('guildConfig', {
    guild: DataTypes.TEXT,
    textChannel: DataTypes.TEXT,
    webhookMessage: DataTypes.TEXT,
    autoplay: DataTypes.BOOLEAN,
    paused: DataTypes.BOOLEAN,
});
