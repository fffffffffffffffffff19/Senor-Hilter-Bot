const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'shuffleButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // shuffling the current queue
        queue.shuffle();
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
