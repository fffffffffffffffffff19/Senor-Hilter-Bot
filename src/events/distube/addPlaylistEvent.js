const { fetchWebhook } = require('../../class/webhookManager');
const { addPlaylist } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger, fileName } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');
let { AddPlaylist, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('addList', async (queue, playlist) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            const gTemplate = guildMapGet(channel.guild.id);

            if (gTemplate.lastWebhookMenssageId === null) return queue.textChannel.send({ embeds: [addPlaylist(playlist)] });

            const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                await queue.textChannel.send({ embeds: [addPlaylist(playlist)] });
                await AddPlaylist(webhook, queue.songs[0], gTemplate, buttons);

                Error = true;
            });

            if (Error) return Error = false;

            const lastEmbed = lastMsg.embeds[0];

            await queue.textChannel.send({ embeds: [addPlaylist(playlist)] });
            await webhook.deleteMessage(lastMsg);

            await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
