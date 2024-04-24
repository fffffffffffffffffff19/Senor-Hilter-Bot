const { fetchWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = (distube) => {
    distube.on('paused', async (queue) => {
        try {
            const channel = queue.textChannel;
            const guildConfig = guildMapGet(channel.guild.id);
            const webhook = await fetchWebhook(channel);

            try {
                const lastMsg = await webhook.fetchMessage(guildConfig.lastWebhookMenssageId);

                await webhook.editMessage(lastMsg, { embeds: [playSong(queue.songs[0], guildConfig.autoplay, guildConfig.paused)], components: [buttons] });
            } catch (warn) {
                await webhook.send({ embeds: [playSong(queue.songs[0], guildConfig.autoplay, guildConfig.paused)], components: [buttons] });
                createLogger.warn(__filename, warn);
            }
        } catch (erro) { createLogger.error(__filename, erro); }
    });
};
