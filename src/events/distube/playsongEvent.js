const { fetchWebhook, createWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');
let { PlaySong, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('playSong', async (queue, song) => {
        try {
            const gTemplate = guildMapGet(queue.textChannel.guild.id);

            if (queue.voiceChannel.members.size === 1) {
                gTemplate.stop = true;

                return queue.stop();
            }

            if (gTemplate.skipManual === true) return gTemplate.skipManual = false;

            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);

            if (!await webhook) {
                await createWebhook(channel);
                const createdWebhook = await fetchWebhook(channel);

                return createdWebhook.send({ embeds: [playSong(song, gTemplate.autoplay, gTemplate.paused)], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
            }

            if (gTemplate.lastWebhookMenssageId !== null) {
                const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                    await PlaySong(webhook, song, gTemplate, buttons);

                    Error = true;
                });

                if (Error) return Error = false;

                await webhook.editMessage(lastMsg, { embeds: [playSong(song, gTemplate.autoplay, gTemplate.paused)], components: [buttons] });
            } else {
                await PlaySong(webhook, song, gTemplate, buttons);
            }
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
