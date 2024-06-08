const { fetchWebhook } = require('../../class/webhookManager');
const { playSong } = require('../../commands/music/config/response');
const { buttons } = require('./config/buttons');
const { createLogger } = require('../../tools/logger');
const { guildMapGet } = require('../../class/guildTemplate');
const { editEmbed } = require('./config/embedResolver');
let { PlaySong, Error } = require('./config/webhookFetchHandler');

module.exports = (distube) => {
    distube.on('paused', async (queue) => {
        try {
            const channel = queue.textChannel;
            const webhook = await fetchWebhook(channel);
            const gTemplate = guildMapGet(channel.guild.id);

            await editEmbed(gTemplate, PlaySong, playSong, webhook, queue.songs[0], buttons, Error);
        } catch (erro) { createLogger.error(__filename, erro); }
    });
};
