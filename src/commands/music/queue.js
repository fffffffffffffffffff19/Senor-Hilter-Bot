const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../handlers/distube');
const { noQueue, queueList } = require('./config/response');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('A list of all songs on queue.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        await interaction.reply({ embeds: [queueList(queue)] });
    },
};
