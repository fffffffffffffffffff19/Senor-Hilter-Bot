const { guildGet } = require('../class/guildTemplate');
const { createLogger } = require('../class/logger');
const playerErrorHandler = require('../func/playerErrorHandler');
const playerEmbed = require('../assets/embeds/playerEmbed');
const { row1, row2 } = require('../buttons/creating/playerButtons');
const trackDetails = require('./trackDetails');

async function getPanel(client, guildId) {
    const guildConfig = await guildGet(guildId);
    if (!guildConfig?.textChannel) {
        throw new Error(`No player text channel is configured for guild ${guildId}`);
    }

    const playerChannel =
        client.channels.cache.get(guildConfig.textChannel) ||
        (await client.channels.fetch(guildConfig.textChannel));
    if (!playerChannel?.isTextBased() || !playerChannel.messages) {
        throw new Error(`Configured player channel ${guildConfig.textChannel} is unavailable`);
    }

    const panel = await playerErrorHandler(guildConfig, playerChannel, guildId);
    return { ...panel, guildConfig };
}

async function updatePlayerPanel(client, guildId, track) {
    const { webhook, playerMessage, guildConfig } = await getPanel(client, guildId);
    await webhook.editMessage(playerMessage, {
        embeds: [
            playerEmbed({
                track: trackDetails(track),
                autoplay: guildConfig.autoplay,
                paused: guildConfig.paused,
                repeatMode: guildConfig.repeatMode,
            }),
        ],
    });
}

async function resetPlayerPanel(client, guildId) {
    const { webhook, playerMessage } = await getPanel(client, guildId);
    await webhook.editMessage(playerMessage, {
        embeds: [playerEmbed()],
        components: [row1, row2],
    });
}

async function sendTemporaryNotice(client, guildId, payload) {
    const { webhook } = await getPanel(client, guildId);
    const message = await webhook.send(payload);
    const timeout = setTimeout(() => {
        message.delete().catch((error) => {
            createLogger.warn(`Could not delete temporary player notice: ${error.message}`);
        });
    }, 10_000);
    timeout.unref();
}

module.exports = { getPanel, updatePlayerPanel, resetPlayerPanel, sendTemporaryNotice };
