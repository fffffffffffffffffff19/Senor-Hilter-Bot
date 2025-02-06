const { guildGet, guildUpdate } = require('../../class/guildTemplate');
const { row1, row2 } = require('../../buttons/creating/playerButtons');
const playerEmbed = require('../../assets/embeds/playerEmbed');
const playerErrorHandler = require('../../func/playerErrorHandler');

module.exports = (distube) => {
    distube.on('finish', async (queue) => {
        const guildId = queue.voiceChannel.guild.id;
        const guildConfig = await guildGet(guildId);
        const playerChannel = await queue.voiceChannel.guild.channels.cache.get(guildConfig.textChannel);
        const { webhook, playerMessage } = await playerErrorHandler(guildConfig, playerChannel, guildId);

        await playerMessage.delete();

        await webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(async (msg) => {
            await guildUpdate({
                guildId: guildId,
                autoplay: false,
                paused: false,
                webhookMessage: msg,
            });
        });
    });
};
