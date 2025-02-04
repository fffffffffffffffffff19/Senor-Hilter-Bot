const { noQueueToSkip } = require('../../assets/txt/response');
const { guildGet } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'nextButton',
    async execute(buttonInteraction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(buttonInteraction);
        const guildConfig = await guildGet(guildId);
        // returning if have any error
        if (error) return;
        // returning if not have song to skip
        if (queue.songs.length === 1 && guildConfig.autoplay == false) {
            return buttonInteraction.reply({ content: noQueueToSkip, ephemeral: true });
        }
        // skipping current song on queue
        queue.skip();
        // replying interaction and deleting then
        await buttonInteraction.deferReply();
        await buttonInteraction.deleteReply();
    },
};
