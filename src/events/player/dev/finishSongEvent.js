const { guildGet } = require('../../class/guildTemplate');
const playerEmbed = require('../../assets/embeds/playerEmbed');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (player) => {
    player.events.on('emptyQueue', async (queue, track) => {
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.channel.guild.channels.cache.get(guildConfig.textChannel);
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);

        await webhook.editMessage(playerMessage, {
            embeds: [playerEmbed({ track, autoplay: guildConfig.autoplay, paused: guildConfig.paused })],
        });
    });
};
