const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const addPlaylist = require('../../assets/embeds/addPlaylistEmbed');

module.exports = (player) => {
    player.events.on('audioTracksAdd', async (queue, playlist) => {
        // getting guild info
        const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);
        // get webhook and send new song added on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [addPlaylist(playlist)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 15000)); // 15 seconds
    });
};
