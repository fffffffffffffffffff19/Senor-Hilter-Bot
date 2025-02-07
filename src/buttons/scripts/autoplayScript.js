const { QueueRepeatMode } = require('discord-player');
const { guildUpdate } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'autoplayButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // toggle autoplay in queue
        queue.repeatMode ? queue.setRepeatMode(QueueRepeatMode.OFF) : queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        // updating guild config on db
        await guildUpdate({ guildId: guildId, autoplay: queue.repeatMode ? true : false });
        // emiting a new bot event
        queue.emit('autoplay', queue);
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
