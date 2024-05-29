const { fetchWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');
let { PlaySong, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('autoplay', async (queue) => {
        try {
            const channel = queue.textChannel;
            const gTemplate = guildMapGet(channel.guild.id);
            const webhook = await fetchWebhook(channel);

            if (gTemplate.lastWebhookMenssageId !== null) {
                const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                    await PlaySong(webhook, queue.songs[0], gTemplate, buttons);

                    Error = true;
                });

                if (Error) return Error = false;

                await webhook.editMessage(lastMsg, { embeds: [playSong(queue.songs[0], gTemplate.autoplay, gTemplate.paused)], components: [buttons] });
            } else {
                await PlaySong(webhook, queue.songs[0], gTemplate, buttons);
            }
        } catch (erro) { createLogger.error(__filename, erro); }
    });
};
