const { fetchWebhook } = require('../../class/webhookManager');
const { addPlaylist } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = (distube) => {
    distube.on('addList', async (queue, playlist) => {
        try {
            const channel = queue.textChannel;
            const guildConfig = guildMapGet(channel.guild.id);
            const webhook = await fetchWebhook(channel);

            try {
                const lastMsg = await webhook.fetchMessage(guildConfig.lastWebhookMenssageId);
                const lastEmbed = lastMsg.embeds[0];

                await queue.textChannel.send({ embeds: [addPlaylist(playlist)] });
                await webhook.deleteMessage(lastMsg);
                await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => {
                    guildConfig.lastWebhookMenssageId = msg.id;
                });
            } catch (warn) {
                await queue.textChannel.send({ embeds: [addPlaylist(playlist)] });
                createLogger.warn(__filename, warn);
            }
        } catch (erro) {
            createLogger.error(fileName, erro);
        }
    });
};
