const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../handlers/distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.', ephemeral: true });
        if (!queue.songs[1]) return interaction.reply({ content: 'No have song to skip on queue.', ephemeral: true });

        await interaction.deferReply('1');
        await interaction.deleteReply();

        client.skipManual = true;
        await queue.skip();

        queue.emit('skip', queue);
    },
};
