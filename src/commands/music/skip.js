const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { noQueueToSkip } = require('../../assets/txt/response');
const { guildGet } = require('../../class/guildTemplate');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    data: new SlashCommandBuilder().setName('skip').setDescription('Skip current song.'),
    async execute(interaction) {
        // getting guildId, player queue and any error
        const { guildId, queue, error } = await commandErrorHandler(interaction);
        // returning if have any error
        if (error) return;
        // getting guild config
        const guildConfig = await guildGet(guildId);
        // returning if not have song to skip
        if (queue.tracks.data.length === 0 && guildConfig.autoplay == false) {
            return interaction.reply({ content: noQueueToSkip, flags: MessageFlags.Ephemeral });
        }
        // skipping current song on queue
        queue.node.skip();
        // replying interaction and deleting then
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
