require('dotenv').config();

const { Collection } = require('discord.js');
const { client, lavalink } = require('./main');
const { findHandlers } = require('./class/fileExplorer');
const { createLogger, fileName } = require('./class/logger');
const database = require('./database/sequelize');
const guildConfigDatabase = require('./database/models/guildConfig');
const registerEvents = require('./handlers/events');
const registerAudioEvents = require('./audio/events');

async function start() {
    const requiredEnvironment = ['TOKEN', 'CLIENT_ID', 'LAVALINK_PASSWORD'];
    const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);

    if (missingEnvironment.length) {
        throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`);
    }

    await database.authenticate();
    await guildConfigDatabase.sync();

    client.guildConfig = new Collection();

    for (const handler of findHandlers()) {
        require(handler)(client);
    }

    registerEvents(client);
    registerAudioEvents(client, lavalink);

    client.on('raw', (packet) => {
        lavalink.sendRawData(packet).catch((error) => {
            createLogger.error(fileName(__filename), error);
        });
    });

    await client.login(process.env.TOKEN);
}

start().catch((error) => {
    createLogger.error(fileName(__filename), error);
    process.exitCode = 1;
});
