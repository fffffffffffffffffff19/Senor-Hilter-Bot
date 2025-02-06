const { guildGet } = require('../../class/guildTemplate');
const playerErrorHandler = require('../../func/playerErrorHandler');
const playerEmbed = require('../../assets/embeds/playerEmbed');

module.exports = (distube) => {
    distube.on('playSong', async (queue, song) => {
        const hasMember = queue.voiceChannel.members.size > 1;
        // checking if has member on voice channel
        if (!hasMember) queue.stop();

        const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);

        await webhook.editMessage(playerMessage, {
            embeds: [playerEmbed({ song, autoplay: guildConfig.autoplay, paused: guildConfig.paused })],
        });
    });
};
