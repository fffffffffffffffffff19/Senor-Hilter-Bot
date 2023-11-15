const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current paused song'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.' });

        if (!queue.paused) return interaction.reply({ content: 'This song is not paused.' });

        queue.resume();
        await interaction.reply({ content: 'Resumed the song.' });
    },
};
