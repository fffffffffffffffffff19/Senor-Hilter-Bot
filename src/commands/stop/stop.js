const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current qeue'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.' });

        await queue.stop();

        const embed = new EmbedBuilder()
            .setDescription('Stopped current queue.')
            .setColor('#ff0000')
            .setTimestamp(new Date().getTime());

        await interaction.reply({ embeds: [embed] });
    },
};
