/* eslint-disable no-unused-vars */
const { row1, row2 } = require('../buttons/creating/playerButtons');
const { guildUpdate } = require('../class/guildTemplate');
const { fetchWebhook, createWebhook, getWebhook } = require('../class/webhookManager');
const playerEmbed = require('../assets/embeds/playerEmbed');

module.exports = async (guildConfig, playerChannel, guildId) => {
    // checking if webhook id on db exists on player channel
    if (!(await fetchWebhook(playerChannel))) await createWebhook(playerChannel);
    // getting webhook from player channel
    const webhook = await getWebhook(playerChannel);
    let playerMessage;
    // checking if player message exists on player channel
    try {
        playerMessage = await playerChannel.messages.fetch({
            message: guildConfig.webhookMessage,
            cache: true,
        });
    } catch (error) {
        // if not, sending a new one and updating then on db
        return webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(async (msg) => {
            await guildUpdate({ guildId: guildId, webhookMessage: msg });
        });
    }
    // checking if player message as sent from the same webhook on channel
    try {
        await playerMessage.fetchWebhook();
    } catch (error) {
        // if not, seding a new one and updating then on db
        await playerMessage.delete();
        return webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(async (msg) => {
            await guildUpdate({ guildId: guildId, webhookMessage: msg });
        });
    }

    return { webhook, playerMessage };
};
