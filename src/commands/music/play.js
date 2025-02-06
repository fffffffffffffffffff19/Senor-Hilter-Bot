const { SlashCommandBuilder } = require('discord.js');
const { guildGet } = require('../../class/guildTemplate');
const { useMainPlayer } = require('discord-player');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add and Play musics')
        .addStringOption((option) => option.setName('music').setDescription('music link or name').setRequired(true)),
    //.addBooleanOption((option) => option.setName('skip').setDescription('skip to this music ?')),
    async execute(interaction) {
        //const { guildId, voiceChannel, member, error } = await commandErrorHandler(interaction, true);
        const voiceChannel = interaction.member.voice.channel;
        const player = useMainPlayer();
        //const guildConfig = await guildGet(guildId);
        //const playerChannel = interaction.guild.channels.cache.get(guildConfig.textChannel);
        const userRequest = await interaction.options.getString('music');

        await player.play(voiceChannel, userRequest, {
            nodeOptions: {
                metadata: { channel: interaction.channel },
            },
        });
        /*         // getting guild id, interaction voice channel, interaction member
        // and any error if have
        // returning if have any error
        if (error) return;
        // getting guild config, user song request and player text channel
        const userRequest = await interaction.options.getString('music');
        //  playskip is bugged now
        // const skip = await interaction.options.getBoolean('skip');
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
        // add song or play user song requested
        await distube.play(voiceChannel, userRequest, { member: member, textChannel: playerChannel }); */
    },
};
