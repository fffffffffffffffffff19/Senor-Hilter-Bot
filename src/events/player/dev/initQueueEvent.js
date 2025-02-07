const { guildUpdate } = require('../../class/guildTemplate');

module.exports = (player) => {
    player.events.on('playerStart', async (queue) => {
        // getting guild info when the queue init
        const guildId = queue.options.guild.id;
        // updating  guild config on db
        await guildUpdate({ guildId: guildId, autoplay: false, paused: false });
    });
};
