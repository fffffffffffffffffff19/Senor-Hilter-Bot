const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'stopButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // stopping current queue and emiting a new bot event
        queue.emit('emptyQueue', queue);
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
