const { useHistory } = require('discord-player');
const { noPreviousSong } = require('../../assets/txt/response');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('previous').setDescription('play the previous song'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // getting all track history from the queue
        const trackHistory = useHistory(queue.options.guild.id);
        // return if not have any previous track
        if (!trackHistory.previousTrack) {
            return interaction.reply({ content: noPreviousSong, flags: MessageFlags.Ephemeral });
        }
        // playing the previous song
        await trackHistory.previous();
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
