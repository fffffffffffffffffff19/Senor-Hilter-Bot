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
            const gTemplate = guildMapGet(channel.guild.id);

            const webhook = await fetchWebhook(channel);
            let { lastWebhookMenssageId } = guildMapGet(channel.guild.id);

            if (gTemplate.lastWebhookMenssageId !== null) {
                // let error = 'WHY .CATCH DONT STOP THE SCRIPT TTTT?????????????????????? BRUHHHHH';
                const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                    await queue.textChannel.send({ embeds: [addSong(song)] });
                    await PlaySong(webhook, song, gTemplate, buttons);

                    Error = true;
                    // error = true;
                });

                if (Error) return Error = false;

                const lastEmbed = lastMsg.embeds[0];

                await queue.textChannel.send({ embeds: [addSong(song)] });
                await webhook.deleteMessage(lastMsg);

                await webhook.send({ embeds: [lastEmbed], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
            } else {
                await queue.textChannel.send({ embeds: [addSong(song)] });
            }
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
