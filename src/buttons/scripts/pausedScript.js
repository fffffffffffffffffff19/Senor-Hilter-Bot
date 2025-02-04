const { guildUpdate } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'pausedButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: queue.isPaused() ? true : false });
        // pause or resume current queue and emiting a new bot event
        queue.isPaused() ? queue.resume() : queue.pause();
        queue.emit('paused', queue);
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
