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
                    return webhook.deleteMessage(lastMsg);
                }

                gTemplate.lastWebhookMenssageId = null;

                await queue.textChannel.send({ embeds: [finishedSong(song)] });
                await webhook.deleteMessage(lastMsg);
            };

            if (gTemplate.lastWebhookMenssageId === null) return PlaySong(webhook, song, gTemplate, buttons);

            const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                const lastMsgFromError = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId);

                await PlaySong(webhook, song, gTemplate, buttons);
                await finishEmbedHandler(lastMsgFromError);

                Error = true;
            });

            if (Error) return Error = false;

            await finishEmbedHandler(lastMsg);
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
