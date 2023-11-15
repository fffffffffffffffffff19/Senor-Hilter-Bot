const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause current song'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.' });

        if (queue.paused) {
            queue.resume();
            return interaction.reply({ content: 'This song is already paused' });
        }

        queue.pause();
        await interaction.reply({ content: 'Paused the song.' });
    },
};
