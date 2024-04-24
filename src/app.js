require('dotenv').config();
const { Collection } = require('discord.js');
const { client, distube } = require('./main');
const { findHandlers, findDistubeEvents } = require('./tools/fileExplorer');
const { createLogger, fileName } = require('./tools/logger');

// logando o client do bot
client.login(process.env.TOKEN);

// init no template da guildConfig
client.guildConfig = new Collection();

// procura os arquivos dos handlers e eventos do distube
try {
    findHandlers().forEach((handler) => require(handler)(client));
    findDistubeEvents().forEach((distubeEvent) => require(distubeEvent)(distube));
} catch (erro) { createLogger.error(fileName(__filename), erro); }
