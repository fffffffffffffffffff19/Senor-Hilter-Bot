const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { noPreviousSong } = require('../../assets/txt/response');
const { playPrevious } = require('../../audio/controls');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('previous').setDescription('Play the previous song'),
    async execute(interaction) {
        const { player, error } = await commandErrorHandler(interaction);
        if (error) return;
        if (!(await playPrevious(player))) {
            return interaction.reply({ content: noPreviousSong, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
