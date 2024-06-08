const { fetchWebhook } = require('../../class/webhookManager');
const { addSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');
let { PlaySong, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('addSong', async (queue, song) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            const gTemplate = guildMapGet(channel.guild.id);

            if (gTemplate.lastWebhookMenssageId === null) return queue.textChannel.send({ embeds: [addSong(song)] });

            const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                await queue.textChannel.send({ embeds: [addSong(song)] });
                await PlaySong(webhook, song, gTemplate, buttons);

                Error = true;
            });

            if (Error) return Error = false;

            const lastEmbed = lastMsg.embeds[0];

            await queue.textChannel.send({ embeds: [addSong(song)] });
            await webhook.deleteMessage(lastMsg);

            await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
