const client = require('../../../app');
const { WebhookManager } = require('../../commands/music/config/webhookManager');
const { addSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');

module.exports = (distube) => {
    distube.on('addSong', async (queue, song) => {
        const channel = queue.textChannel;
        const webhook = await WebhookManager.fetchWebhook(channel);

        try {
            const lastMsg = await webhook.fetchMessage(client.lastWebhookMenssageId);
            const lastEmbed = lastMsg.embeds[0];

            await queue.textChannel.send({ embeds: [addSong(song)] });
            await webhook.deleteMessage(lastMsg);
            await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => {
                client.lastWebhookMenssageId = msg.id;
            });
        } catch (e) {
            await queue.textChannel.send({ embeds: [addSong(song)] });
        }
    });
};
