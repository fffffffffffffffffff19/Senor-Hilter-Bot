const { guildGet, guildUpdate } = require('../../class/guildTemplate');
const { row1, row2 } = require('../../buttons/creating/playerButtons');
const playerEmbed = require('../../assets/embeds/playerEmbed');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (player) => {
    player.events.on('emptyQueue', async (queue) => {
        // getting guild info
        const guildId = queue.options.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.channel.guild.channels.cache.get(guildConfig.textChannel);
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);
        // deleting old player embed
        await playerMessage.delete();
        // sending a new one and updatind the guild config on db
        await webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(async (msg) => {
            await guildUpdate({
                guildId: guildId,
                autoplay: false,
                paused: false,
                webhookMessage: msg,
            });
        });

        queue.delete(queue.options.guild.id);
    });
};
