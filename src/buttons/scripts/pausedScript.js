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
        // updating the guild config on db
        await guildUpdate({ guildId: guildId, paused: timeLine.paused ? true : false });
        // pause or resume current queue and emiting a new bot event
        timeLine.paused ? timeLine.resume() : timeLine.pause();
        queue.emit('paused', queue);
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
