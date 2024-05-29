const { fetchWebhook } = require('../../class/webhookManager');
const { addSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = (distube) => {
    distube.on('addSong', async (queue, song) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            let { lastWebhookMenssageId } = guildMapGet(channel.guild.id);

            if (!lastWebhookMenssageId === null) {
                const lastMsg = await webhook.fetchMessage(lastWebhookMenssageId);
                const lastEmbed = lastMsg.embeds[0];

                await queue.textChannel.send({ embeds: [addSong(song)] });
                await webhook.deleteMessage(lastMsg);
                await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => {
                    lastWebhookMenssageId = msg.id;
                });
            } else {
                await queue.textChannel.send({ embeds: [addSong(song)] });
            }
        } catch (erro) {
            createLogger.error(fileName, erro);
        }
    });
};
