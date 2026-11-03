const { SlashCommandBuilder } = require('discord.js');
const { shuffle } = require('../../audio/controls');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the current queue'),
    async execute(interaction) {
        const { player, error } = await commandErrorHandler(interaction);
        if (error) return;

        await shuffle(player);
        await interaction.deferReply();
        await sendTemporaryNotice(interaction.client, interaction.guildId, {
            content: 'Queue shuffled.',
        });
        await interaction.deleteReply();
    },
};
