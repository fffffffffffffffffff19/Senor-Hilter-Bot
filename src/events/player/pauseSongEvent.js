const { guildGet } = require('../../class/guildTemplate');
const playerEmbed = require('../../assets/embeds/playerEmbed');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (player) => {
    player.events.on('paused', async (queue) => {
        // getting track from queue
        const track = queue.dispatcher.audioResource.metadata;
        // getting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.channel.guild.channels.cache.get(guildConfig.textChannel);
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);
        // editting player embed with pause status
        await webhook.editMessage(playerMessage, {
            embeds: [playerEmbed({ track: track, autoplay: guildConfig.autoplay, paused: guildConfig.paused })],
        });
    });
};
