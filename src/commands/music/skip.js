const { SlashCommandBuilder } = require('discord.js');
const { noQueue } = require('./config/response');
const distube = require('../../../distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        try {
            await queue.skip();

            await interaction.deferReply('1');
            await interaction.deleteReply();

            client.skipManual = true;
            queue.emit('skip', queue);
        } catch (e) {
            return interaction.reply({ content: noQueue, ephemeral: true });
        }
    },
};
