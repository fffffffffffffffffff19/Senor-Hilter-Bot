const { guildGet } = require('../../class/guildTemplate');
const { getWebhook } = require('../../class/webhookManager');
const addSong = require('../../assets/embeds/addSongEmbed');

module.exports = (player) => {
    player.events.on('audioTrackAdd', async (queue, track) => {
        //console.log(track);
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = queue.options.guild.channels.cache.get(guildConfig.textChannel);

        // get webhook and send new song added on player channel
        const webhook = await getWebhook(playerChannel);
        await webhook
            .send({ embeds: [addSong(track)] })
            .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 15000));
    });
};
