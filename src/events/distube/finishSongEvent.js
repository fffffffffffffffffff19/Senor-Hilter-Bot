const { fetchWebhook } = require('../../class/webhookManager');
const { skipedSong, finishedSong } = require('../../commands/music/config/response');
const { guildMapGet, guildMapDelete } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');

module.exports = (distube) => {
    distube.on('finishSong', async (queue, song) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            // eslint-disable-next-line prefer-const
            let { lastWebhookMenssageId, stop, skipManual, autoplay, paused } = guildMapGet(channel.guild.id);

            if (!lastWebhookMenssageId === null) {
                const lastMsg = await webhook.fetchMessage(lastWebhookMenssageId);

                if (stop) {
                    guildMapDelete(channel.guild.id);

                    await queue.textChannel.send({ embeds: [finishedSong(song)] });
                    return webhook.deleteMessage(lastMsg);
                }

                if (skipManual) {
                    skipManual = false;
                    lastWebhookMenssageId = null;

                    await queue.textChannel.send({ embeds: [skipedSong(song)] });
                    await webhook.deleteMessage(lastMsg);
                } else {
                    lastWebhookMenssageId = null;

                    await queue.textChannel.send({ embeds: [finishedSong(song)] });
                    await webhook.deleteMessage(lastMsg);
                }
            } else {
                await webhook.send({ embeds: [playSong(song, autoplay, paused)], components: [buttons] }).then((msg) => lastWebhookMenssageId = msg.id);
            }
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
