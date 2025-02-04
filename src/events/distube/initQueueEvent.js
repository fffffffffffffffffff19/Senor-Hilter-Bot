const { guildGet } = require('../../class/guildTemplate');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (distube) => {
    distube.on('initQueue', async (queue) => {
        const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);

        await playerErrorHandler(guildConfig, playerChannel, guildId);
    });
};
