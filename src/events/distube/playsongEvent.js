const { fetchWebhook, createWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { guildMapGet } = require('../../class/guildTemplate');
const { createLogger, fileName } = require('../../tools/logger');
const { editEmbed } = require('./config/embedResolver');
let { PlaySong, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('playSong', async (queue, song) => {
        try {
            const gTemplate = guildMapGet(queue.textChannel.guild.id);

            if (queue.voiceChannel.members.size === 1) {
                gTemplate.stop = true;

                return queue.stop();
            }

            if (gTemplate.skipManual === true) return gTemplate.skipManual = false;

            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);

            if (!await webhook) {
                await createWebhook(channel);
                const createdWebhook = await fetchWebhook(channel);

                return createdWebhook.send({ embeds: [playSong(song, gTemplate.autoplay, gTemplate.paused)], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
            }

            await editEmbed(gTemplate, PlaySong, playSong, webhook, song, buttons, Error);
        } catch (erro) { createLogger.error(fileName, erro); }
    });
};
