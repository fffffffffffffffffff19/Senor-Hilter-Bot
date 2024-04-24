const { fetchWebhook } = require('../../class/webhookManager');
const { addSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = (distube) => {
    distube.on('addSong', async (queue, song) => {
        try {
            const channel = queue.textChannel;
            const guildConfig = guildMapGet(queue.textChannel.guild.id);
            const webhook = await fetchWebhook(channel);

            try {
                const lastMsg = await webhook.fetchMessage(guildConfig.lastWebhookMenssageId);
                const lastEmbed = lastMsg.embeds[0];

                await queue.textChannel.send({ embeds: [addSong(song)] });
                await webhook.deleteMessage(lastMsg);
                await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => {
                    guildConfig.lastWebhookMenssageId = msg.id;
                });
            } catch (warn) {
                await queue.textChannel.send({ embeds: [addSong(song)] });
                createLogger.warn(fileName, warn);
            }
        } catch (erro) {
            createLogger.error(fileName, erro);
        }
    });
};
