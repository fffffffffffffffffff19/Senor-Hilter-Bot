const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const autoplayEmbed = require('../../assets/embeds/autoplayEmbed');

module.exports = (player) => {
    player.events.on('autoplay', async (queue) => {
        // getting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.channel.guild.channels.cache.get(guildConfig.textChannel);
        // get webhook and send autoplay enabled on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [await autoplayEmbed(guildConfig.autoplay)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 10000)); // 10 seconds
    });
};
