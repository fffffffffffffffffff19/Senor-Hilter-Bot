module.exports = {
    id: 'addToPlaylistButton',
    async execute(buttonInteraction) {
        buttonInteraction.reply({ content: ';)', ephemeral: true });
    },
};
