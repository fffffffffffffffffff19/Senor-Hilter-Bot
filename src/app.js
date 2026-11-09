require('dotenv').config();

const { Collection } = require('discord.js');
const { client, lavalink } = require('./main');
const { findHandlers } = require('./class/fileExplorer');
const { createLogger, fileName } = require('./class/logger');
const database = require('./database/sequelize');
const guildConfigDatabase = require('./database/models/guildConfig');
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

    registerAudioEvents(client, lavalink);

    client.on('raw', (packet) => {
        if (packet.t && client.ws) {
            client.ws.emit(packet.t, packet.d);
        }
        if (typeof lavalink?.sendRawData === 'function') {
            lavalink.sendRawData(packet).catch((error) => {
                createLogger.error(fileName(__filename), error);
            });
        }
    });

    await client.login(process.env.TOKEN);
}

process.on('unhandledRejection', (error) => {
    createLogger.error('[UnhandledRejection] -', error);
});

process.on('uncaughtException', (error) => {
    createLogger.error('[UncaughtException] -', error);
});

if (require.main === module) {
    start().catch((error) => {
        createLogger.error(fileName(__filename), error);
        process.exitCode = 1;
    });
}

module.exports = start;
