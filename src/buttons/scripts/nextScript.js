const { MessageFlags } = require('discord.js');
const { guildGet } = require('../../class/guildTemplate');
const { noQueueToSkip } = require('../../assets/txt/response');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'nextButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(buttonInteraction);
        // returning if have any error
        if (error) return;
        // getting guild config
        const guildConfig = await guildGet(guildId);
        // returning if not have song to skip
        if (queue.tracks.data.length === 0 && guildConfig.autoplay == false) {
            return buttonInteraction.reply({ content: noQueueToSkip, flags: MessageFlags.Ephemeral });
        }
        // skipping current song on queue
        queue.node.skip();
        // replying interaction and deleting then
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
