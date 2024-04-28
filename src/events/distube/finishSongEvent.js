const { fetchWebhook } = require('../../class/webhookManager');
const { skipedSong, finishedSong } = require('../../commands/music/config/response');
const { guildMapGet, guildMapDelete } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');

module.exports = (distube) => {
    distube.on('finishSong', async (queue, song) => {
        const channel = queue.textChannel;
        const guildConfig = guildMapGet(channel.guild.id);
        const webhook = await fetchWebhook(channel);
        try {
            const lastMsg = await webhook.fetchMessage(guildConfig.lastWebhookMenssageId);

            if (guildConfig.stop) {
                guildMapDelete(channel.guild.id);

                await queue.textChannel.send({ embeds: [finishedSong(song)] });
                return webhook.deleteMessage(lastMsg);
            }

            if (guildConfig.skipManual) {
                guildConfig.skipManual = false;
                guildConfig.lastWebhookMenssageId = null;

                await queue.textChannel.send({ embeds: [skipedSong(song)] });
                await webhook.deleteMessage(lastMsg);
            } else {
                guildConfig.lastWebhookMenssageId = null;

                await queue.textChannel.send({ embeds: [finishedSong(song)] });
                await webhook.deleteMessage(lastMsg);
            }
        } catch (erro) {
            await webhook.send({ embeds: [playSong(song, guildConfig.autoplay, guildConfig.paused)], components: [buttons] }).then((msg) => {
                guildConfig.lastWebhookMenssageId = msg.id;
            });
            createLogger.error(fileName, erro);
        }
    });
};
