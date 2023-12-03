const { WebhookManager } = require('../../commands/music/config/webhookManager');
const { skipedSong, finishedSong } = require('../../commands/music/config/response');
const client = require('../../../app');

module.exports = (distube) => {
    distube.on('finishSong', async (queue, song) => {
        const channel = queue.textChannel;
        const webhook = await WebhookManager.fetchWebhook(channel);
        const lastMsg = await webhook.fetchMessage(client.lastWebhookMenssageId);

        if (client.stop) {
            await queue.textChannel.send({ embeds: [finishedSong(song)] });

            try {
                await webhook.deleteMessage(lastMsg);
            } catch (e) {
                console.log(e);
            }

            client.lastWebhookMenssageId = null;
            return;
        }

        if (client.skipManual) {
            client.skipManual = false;

            await queue.textChannel.send({ embeds: [skipedSong(song)] });

            try {
                await webhook.deleteMessage(lastMsg);
            } catch (e) {
                console.log(e);
            }

            client.lastWebhookMenssageId = null;
        } else {
            await queue.textChannel.send({ embeds: [finishedSong(song)] });

            try {
                await webhook.deleteMessage(lastMsg);
            } catch (e) {
                console.log(e);
            }

            client.lastWebhookMenssageId = null;
        }
    });
};
