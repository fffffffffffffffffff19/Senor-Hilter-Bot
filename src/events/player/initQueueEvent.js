const { guildGet } = require('../../class/guildTemplate');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (player) => {
    player.events.on('playerStart', async (queue, track) => {
        console.log(queue);
        console.log(track);
        /*         const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);

        await playerErrorHandler(guildConfig, playerChannel, guildId); */
    });
};
