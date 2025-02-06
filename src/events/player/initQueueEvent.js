const { guildGet } = require('../../class/guildTemplate');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (player) => {
    player.events.on('playerStart', async (queue) => {
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.options.guild.channels.cache.get(guildConfig.textChannel);

        await playerErrorHandler(guildConfig, playerChannel, guildId);
    });
};
