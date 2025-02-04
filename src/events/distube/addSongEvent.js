const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const addSong = require('../../assets/embeds/addSongEmbed');

module.exports = (distube) => {
    distube.on('addSong', async (queue, song) => {
        const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);

        // get webhook and send new song added on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [addSong(song)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 15000));
    });
};
