const { SlashCommandBuilder } = require('discord.js');
const { needVoiceChannel, linkNotSuported } = require('./config/response');
const distube = require('../../../distube');
const client = require('../../../app');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play music')
        .addStringOption((option) => option
            .setName('music')
            .setDescription('Send the music link or name to play.')
            .setRequired(true)),
    async execute(interaction) {
        if (client.stop) client.stop = false;

        const member = interaction.guild.members.cache.get(interaction.member.id);
        const { channel } = member.voice;

        if (!channel) return interaction.reply({ content: needVoiceChannel, ephemeral: true });

        const userRequest = await interaction.options.getString('music');
        const regex = /\/intl-[a-z]{2}\//;
        const repleced = userRequest.replace(regex, '/');

        if (!userRequest.match(regex)) {
            try {
                await interaction.deferReply('1');
                await interaction.deleteReply();

                await distube.play(channel, userRequest, { member, textChannel: interaction.channel });
            } catch (e) {
                return interaction.reply({ content: linkNotSuported, ephemeral: true });
            }
        } else {
            try {
                await interaction.deferReply('1');
                await interaction.deleteReply();

                await distube.play(channel, repleced, { member, textChannel: interaction.channel });
            } catch (e) {
                return interaction.deferReply({ content: linkNotSuported, ephemeral: true });
            }
        }
    },
};
