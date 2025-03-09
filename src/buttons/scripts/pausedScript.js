const { guildUpdate } = require('../../class/guildTemplate');
const { useTimeline } = require('discord-player');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'pausedButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // geting the timeLine instance from the guildId
        const timeLine = useTimeline({ node: guildId });
        // pause or resume current queue
        timeLine.paused ? timeLine.resume() : timeLine.pause();
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: timeLine.paused ? true : false });
        // emiting new bot event
        queue.emit('paused', queue);
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
