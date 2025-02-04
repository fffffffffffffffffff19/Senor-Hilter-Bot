const { client, distube } = require('./main');
const { Collection } = require('discord.js');
const { findHandlers, findDistubeEvents } = require('./class/fileExplorer');
const { createLogger, fileName } = require('./class/logger');
const database = require('../src/database/sequelize');
const guildConfigDatabase = require('./database/models/guildConfig');

require('dotenv').config();

client.login(process.env.TOKEN);
client.guildConfig = new Collection();

const finders = () => {
    findHandlers().forEach((handler) => require(handler)(client));
    findDistubeEvents().forEach((distubeEvent) => require(distubeEvent)(distube));
};

(async () => {
    try {
        await database.authenticate();
        await guildConfigDatabase.sync();
        finders();
    } catch (erro) {
        createLogger.error(fileName(__filename), erro);
    }
})();
