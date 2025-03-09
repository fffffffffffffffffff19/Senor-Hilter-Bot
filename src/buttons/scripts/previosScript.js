const { MessageFlags } = require('discord.js');
const { useHistory } = require('discord-player');
const { noPreviousSong } = require('../../assets/txt/response');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'previosButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // getting all track history from the queue
        const trackHistory = useHistory(queue.options.guild.id);
        // return if not have any previous track
        if (!trackHistory.previousTrack) {
            return buttonInteraction.reply({ content: noPreviousSong, flags: MessageFlags.Ephemeral });
        }
        // playing the previous song
        await trackHistory.previous();
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
