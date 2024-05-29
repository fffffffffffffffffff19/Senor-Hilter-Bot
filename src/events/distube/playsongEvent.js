const { fetchWebhook, createWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = (distube) => {
    distube.on('playSong', async (queue, song) => {
        try {
            // eslint-disable-next-line prefer-const
            let { paused, autoplay, skipManual, lastWebhookMenssageId, stop } = guildMapGet(queue.textChannel.guild.id);

            if (queue.voiceChannel.members.size === 1) {
                // eslint-disable-next-line no-unused-vars
                stop = true;

                return queue.stop();
            }

            if (skipManual === true) return skipManual = false;

            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);

            if (!await webhook) {
                await createWebhook(channel);
                const createdWebhook = await fetchWebhook(channel);

                return createdWebhook.send({ embeds: [playSong(song, autoplay, paused)], components: [buttons] }).then((msg) => lastWebhookMenssageId = msg.id);
            }

            if (!lastWebhookMenssageId === null) {
                const lastMsg = await webhook.fetchMessage(lastWebhookMenssageId);

                await webhook.editMessage(lastMsg, { embeds: [playSong(song, autoplay, paused)], components: [buttons] });
            } else {
                await webhook.send({ embeds: [playSong(song, autoplay, paused)], components: [buttons] }).then((msg) => lastWebhookMenssageId = msg.id);
            }
        } catch (erro) {
            createLogger.error(fileName, erro);
        }
    });
};
