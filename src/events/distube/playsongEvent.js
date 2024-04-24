const { fetchWebhook, createWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = (distube) => {
    distube.on('playSong', async (queue, song) => {
        try {
            const guildConfig = guildMapGet(queue.textChannel.guild.id);

            if (queue.voiceChannel.members.size === 1) {
                guildConfig.stop = true;

                return queue.stop();
            }

            if (guildConfig.skipManual === true) return guildConfig.skipManual = false;

            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);

            if (!await webhook) {
                await createWebhook(channel);
                const createdWebhook = await fetchWebhook(channel);

                await createdWebhook.send({ embeds: [playSong(song, guildConfig.autoplay, guildConfig.paused)], components: [buttons] }).then((msg) => {
                    guildConfig.lastWebhookMenssageId = msg.id;
                });
            } else {
                try {
                    const lastMsg = await webhook.fetchMessage(guildConfig.lastWebhookMenssageId);
                    await webhook.editMessage(lastMsg, { embeds: [playSong(song, guildConfig.autoplay, guildConfig.paused)], components: [buttons] });
                } catch (warn) {
                    await webhook.send({ embeds: [playSong(song, guildConfig.autoplay, guildConfig.paused)], components: [buttons] }).then((msg) => {
                        guildConfig.lastWebhookMenssageId = msg.id;
                    });

                    createLogger.warn(fileName, warn);
                }
            }
        } catch (erro) {
            createLogger.error(fileName, erro);
        }
    });
};
