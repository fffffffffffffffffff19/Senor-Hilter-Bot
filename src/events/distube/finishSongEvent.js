const { fetchWebhook } = require('../../class/webhookManager');
const { skipedSong, finishedSong } = require('../../commands/music/config/response');
const { guildMapGet, guildMapDelete } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');
const { buttons } = require('./config/buttons');
let { PlaySong, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('finishSong', async (queue, song) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            const gTemplate = guildMapGet(channel.guild.id);

            const finishEmbedHandler = async (lastMsg) => {
                if (gTemplate.stop) {
                    guildMapDelete(channel.guild.id);

                    await queue.textChannel.send({ embeds: [finishedSong(song)] });
                    return webhook.deleteMessage(lastMsg);
                }

                if (gTemplate.skipManual) {
                    gTemplate.skipManual = false;
                    gTemplate.lastWebhookMenssageId = null;

                    await queue.textChannel.send({ embeds: [skipedSong(song)] });
                    await webhook.deleteMessage(lastMsg);
                } else {
                    gTemplate.lastWebhookMenssageId = null;

                    await queue.textChannel.send({ embeds: [finishedSong(song)] });
                    await webhook.deleteMessage(lastMsg);
                }
            };

            if (gTemplate.lastWebhookMenssageId !== null) {
                const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                    Error = true;

                    await PlaySong(webhook, song, gTemplate, buttons);

                    const lastMsgFromError = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId);

                    await finishEmbedHandler(lastMsgFromError);
                });

                if (Error) return Error = false;

                await finishEmbedHandler(lastMsg);
            } else {
                await PlaySong(webhook, song, gTemplate, buttons);
            }
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
