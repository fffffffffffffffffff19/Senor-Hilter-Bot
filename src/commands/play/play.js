const { SlashCommandBuilder } = require('discord.js');
const { distube } = require('../../handlers/distube');

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

        if (!userRequest.match(regex)) distube.play(channel, userRequest, { member, textChannel: interaction.channel });
        else distube.play(channel, repleced, { member, textChannel: interaction.channel });
    },
};
