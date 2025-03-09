const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const repeatModeEmbed = require('../../assets/embeds/repeatModeEmbed');

module.exports = (player) => {
    player.events.on('repeatMode', async (queue) => {
        // getting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = queue.options.guild.channels.cache.get(guildConfig.textChannel);
        // get webhook and send new song added on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [await repeatModeEmbed(guildConfig.repeatMode)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 10000)); // 10 seconds
    });
};
