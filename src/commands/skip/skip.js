const { SlashCommandBuilder } = require('discord.js');
const { distube } = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: 'Any song on queue.' });
        if (!queue.songs[1]) return interaction.reply({ content: 'No have song to skip on queue.' });

        await queue.skip();
        await interaction.reply({ content: `Skipped! Now playing:\n${queue.songs[0].url}` });
    },
};
