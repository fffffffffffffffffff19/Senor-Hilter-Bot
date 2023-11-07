const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../handlers/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play music')
        .addStringOption((option) => option
            .setName('music')
            .setDescription('Send the music link or name to play.')
            .setRequired(true)),
    async execute(interaction) {
        const userRequest = await interaction.options.getString('music');
        const member = interaction.guild.members.cache.get(interaction.member.id);
        const { channel } = member.voice;
        const regex = /\/intl-[a-z]{2}\//;
        const repleced = userRequest.replace(regex, '/');

        if (!channel) return interaction.reply({ content: 'You need to join a voice channel.', ephemeral: true });

        await interaction.reply(`Playing:\n${userRequest}`);

        if (!userRequest.match(regex)) player.play(channel, userRequest, { member, textChannel: interaction.channel });
        else player.play(channel, repleced, { member, textChannel: interaction.channel });
    },
};
