const { fetchWebhook } = require('../../class/webhookManager');
const { addPlaylist } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');

module.exports = (distube) => {
    distube.on('addList', async (queue, playlist) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            let { lastWebhookMenssageId } = guildMapGet(channel.guild.id);

            if (!lastWebhookMenssageId === null) {
                const lastMsg = await webhook.fetchMessage(lastWebhookMenssageId);
                const lastEmbed = lastMsg.embeds[0];

                await queue.textChannel.send({ embeds: [addPlaylist(playlist)] });
                await webhook.deleteMessage(lastMsg);
                await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => {
                    lastWebhookMenssageId = msg.id;
                });
            } else {
                await queue.textChannel.send({ embeds: [addPlaylist(playlist)] });
            }
        } catch (erro) {
            createLogger.error(fileName, erro);
        }
    });
};
