const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'previosButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // playing the previous song
        queue.previous();
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
