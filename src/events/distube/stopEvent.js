const { WebhookManager } = require('../../commands/music/config/webhookManager');
const client = require('../../../app');

module.exports = (distube) => {
    distube.on('disconnect', async (queue) => {
        const channel = queue.textChannel;
        const webhook = await WebhookManager.fetchWebhook(channel);
        const lastMsg = await webhook.fetchMessage(client.lastWebhookMenssageId);

        await webhook.deleteMessage(lastMsg);
        client.lastWebhookMenssageId = null;
    });
};
