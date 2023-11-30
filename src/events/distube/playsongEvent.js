const { WebhookManager } = require('../../commands/music/config/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const client = require('../../../app');

module.exports = (distube) => {
    distube.on('playSong', async (queue, song) => {
        if (queue.voiceChannel.members.size === 1) {
            return queue.stop();
        }

        if (await client.skipManual === true) {
            client.skipManual = false;
            return;
        }

        const channel = queue.textChannel;
        const webhook = await WebhookManager.fetchWebhook(channel);

        if (!await webhook) {
            await WebhookManager.createWebhook(channel);
            const createdWebhook = await WebhookManager.fetchWebhook(channel);

            await createdWebhook.send({ embeds: [playSong(song, client.autoplay, client.paused)], components: [buttons] }).then((msg) => {
                client.lastWebhookMenssageId = msg.id;
            });
            return;
        }

        try {
            const lastMsg = await webhook.fetchMessage(client.lastWebhookMenssageId);
            await webhook.editMessage(lastMsg, { embeds: [playSong(song, client.autoplay, client.paused)], components: [buttons] });
        } catch (e) {
            await webhook.send({ embeds: [playSong(song, client.autoplay, client.paused)], components: [buttons] }).then((msg) => {
                client.lastWebhookMenssageId = msg.id;
            });
        }
    });
};
