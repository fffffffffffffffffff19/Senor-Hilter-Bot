const { MessageFlags } = require('discord.js');
const { guildGet } = require('../../class/guildTemplate');
const { noQueueToSkip } = require('../../assets/txt/response');
const { sendTemporaryNotice } = require('../../audio/playerPanel');
const songSkippedEmbed = require('../../assets/embeds/songSkipedEmbed');
const commandErrorHandler = require('../../func/commandErrorHandler');

module.exports = {
    id: 'nextButton',
    async execute(interaction) {
        const { guildId, player, error } = await commandErrorHandler(interaction);
        if (error) return;

        const guildConfig = await guildGet(guildId);
        if (!player.queue.tracks.length && !guildConfig.autoplay) {
            return interaction.reply({ content: noQueueToSkip, flags: MessageFlags.Ephemeral });
        }

        const skippedTrack = player.queue.current;
        await player.skip();
        await interaction.deferUpdate();
        await sendTemporaryNotice(interaction.client, guildId, {
            embeds: [songSkippedEmbed(skippedTrack)],
        });
    },
};
