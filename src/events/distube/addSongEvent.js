const { fetchWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = (distube) => {
    distube.on('autoplay', async (queue) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            const { lastWebhookMenssageId, autoplay, paused } = guildMapGet(channel.guild.id);

            if (!lastWebhookMenssageId === null) {
                const lastMsg = await webhook.fetchMessage(lastWebhookMenssageId);

                await webhook.editMessage(lastMsg, { embeds: [playSong(queue.songs[0], autoplay, paused)], components: [buttons] });
            } else {
                await webhook.send({ embeds: [playSong(queue.songs[0], autoplay, paused)], components: [buttons] });
            }
        } catch (error) { createLogger.error(__filename, error); }
    });
};
