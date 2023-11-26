const { SlashCommandBuilder } = require('discord.js');
const { noQueue } = require('./config/response');
const distube = require('../../handlers/distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: noQueue, ephemeral: true });

        await interaction.deferReply('1');
        await interaction.deleteReply();

        try {
            await queue.skip();
            client.skipManual = true;
            queue.emit('skip', queue);
        } catch (e) {
            return interaction.reply({ content: noQueue, ephemeral: true });
        }
    },
};
