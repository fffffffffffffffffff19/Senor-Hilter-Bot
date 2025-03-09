module.exports = {
    id: 'profileButton',
    async execute(buttonInteraction) {
        buttonInteraction.reply({ content: ';)', ephemeral: true });
    },
};
