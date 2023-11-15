const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const distube = require('../../handlers/distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('A list of all songs on queue.'),
    async execute(interaction) {
        const queue = distube.getQueue(interaction);

        if (!queue) return interaction.reply({ content: 'Any song on queue.', ephemeral: true });

        const queueList = queue.songs
            .map((song, position) => `${position === 0 ? 'Playing:' : `${position}.`} [${song.name}](${song.url})`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Songs on queue')
            .setDescription(queueList)
            .setColor('#000000')
            .setThumbnail(`${queue.songs[0].thumbnail}`)
            .setTimestamp(new Date().getTime());

        await interaction.reply({ embeds: [embed] });
    },
};
