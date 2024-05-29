require('dotenv').config();
const { Collection } = require('discord.js');
const { client, distube } = require('./main');
const { findHandlers, findDistubeEvents } = require('./tools/fileExplorer');
const { createLogger, fileName } = require('./tools/logger');

client.login(process.env.TOKEN);
client.guildConfig = new Collection();

function finders() {
    findHandlers().forEach((handler) => require(handler)(client));
    findDistubeEvents().forEach((distubeEvent) => require(distubeEvent)(distube));
}

try { finders(); } catch (erro) { createLogger.error(fileName(__filename), erro); }
