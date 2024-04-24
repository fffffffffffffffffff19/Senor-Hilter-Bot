const { fetchWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = (distube) => {
    distube.on('autoplay', async (queue) => {
        try {
            const channel = queue.textChannel;
            const guildConfig = guildMapGet(channel.guild.id);
            const webhook = await fetchWebhook(channel);
            const lastMsg = await webhook.fetchMessage(guildConfig.lastWebhookMenssageId);

            await webhook.editMessage(lastMsg, { embeds: [playSong(queue.songs[0], guildConfig.autoplay, guildConfig.paused)], components: [buttons] });
        } catch (error) { createLogger.error(__filename, error); }
    });
};
