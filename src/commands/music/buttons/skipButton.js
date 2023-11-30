const { noQueue, needVoiceChannel } = require('../config/response');
const distube = require('../../../../distube');
const client = require('../../../../app');

module.exports = {
    id: 'skipButton',
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });
        if (!queue.voiceChannel.members.get(interaction.user.id)) return interaction.reply({ content: needVoiceChannel, ephemeral: true });

        try {
            await queue.skip();

            await interaction.deferUpdate();

            client.skipManual = true;
            queue.emit('skip', queue);
        } catch (e) {
            return interaction.reply({ content: noQueue, ephemeral: true });
        }
    },
};
