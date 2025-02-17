const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const songSkipedEmbed = require('../../assets/embeds/songSkipedEmbed');

module.exports = (player) => {
    player.events.on('playerSkip', async (queue, track) => {
        // getting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = queue.options.guild.channels.cache.get(guildConfig.textChannel);
        // get webhook and send new song added on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [songSkipedEmbed(track)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 10000)); // 10 seconds
    });
};
