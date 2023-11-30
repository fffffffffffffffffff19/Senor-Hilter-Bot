const { WebhookManager } = require('../../commands/music/config/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const client = require('../../../app');

module.exports = (distube) => {
    distube.on('paused', async (queue) => {
        const channel = queue.textChannel;
        const webhook = await WebhookManager.fetchWebhook(channel);
        const lastMsg = await webhook.fetchMessage(client.lastWebhookMenssageId);

        await webhook.editMessage(lastMsg, { embeds: [playSong(queue.songs[0], client.autoplay, client.paused)], components: [buttons] });
    });
};
