const { SlashCommandBuilder } = require('discord.js');
const { distube } = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current qeue'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.' });

        await queue.stop();
        await interaction.reply({ content: 'Stopped current queue.' });
    },
};
