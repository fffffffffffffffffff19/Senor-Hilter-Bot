const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const pausedEmbed = require('../../assets/embeds/pausedEmbed');

module.exports = (player) => {
    player.events.on('playerPause', async (queue) => {
        // getting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.channel.guild.channels.cache.get(guildConfig.textChannel);
        // get webhook and send paused msg on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [await pausedEmbed(guildConfig.paused)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 10000)); // 10 seconds
    });
};
