const { SlashCommandBuilder } = require('discord.js');
const { guildGet } = require('../../class/guildTemplate');
const { distube } = require('../../main');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add and Play musics')
        .addStringOption((option) => option.setName('music').setDescription('music link or name').setRequired(true)),
    //.addBooleanOption((option) => option.setName('skip').setDescription('skip to this music ?')),
    async execute(interaction) {
        // getting guild id, interaction voice channel, interaction member
        // and any error if have
        const { guildId, voiceChannel, member, error } = await commandErrorHandler(interaction, true);
        // returning if have any error
        if (error) return;
        // getting guild config, user song request and player text channel
        const guildConfig = await guildGet(guildId);
        const userRequest = await interaction.options.getString('music');
        //  playskip is bugged now
        // const skip = await interaction.options.getBoolean('skip');
        const playerChannel = interaction.guild.channels.cache.get(guildConfig.textChannel);
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
        // add song or play user song requested
        await distube.play(voiceChannel, userRequest, { member: member, textChannel: playerChannel });
    },
};
