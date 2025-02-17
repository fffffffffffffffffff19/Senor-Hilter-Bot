const { guildGet } = require('../../class/guildTemplate');
const playerErrorHandler = require('../../func/playerErrorHandler');
const playerEmbed = require('../../assets/embeds/playerEmbed');

module.exports = (player) => {
    player.events.on('playerStart', async (queue, track) => {
        // checking if has member on voice channel
        const hasMember = queue.channel.members.size > 1;
        if (!hasMember) return queue.emit('emptyChannel', queue);
        // geting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.options.guild.channels.cache.get(guildConfig.textChannel);
        // checking if have any error on player and edit them
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);
        await webhook.editMessage(playerMessage, {
            embeds: [
                playerEmbed({
                    track,
                    autoplay: guildConfig.autoplay,
                    paused: guildConfig.paused,
                    repeatMode: guildConfig.repeatMode,
                }),
            ],
        });
    });
};
