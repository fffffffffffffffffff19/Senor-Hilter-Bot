const { guildGet } = require('../../class/guildTemplate');
const playerEmbed = require('../../assets/embeds/playerEmbed');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (distube) => {
    distube.on('paused', async (queue) => {
        const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);

        await webhook.editMessage(playerMessage, {
            embeds: [playerEmbed({ autoplay: guildConfig.autoplay, paused: guildConfig.paused })],
        });
    });
};
