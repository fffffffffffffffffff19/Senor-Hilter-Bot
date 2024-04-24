const { Collection, Events } = require('discord.js');
const { findButtons } = require('../tools/fileExplorer');
const { createLogger } = require('../tools/logger');

module.exports = (client) => {
    client.buttons = new Collection();

    for (const button of findButtons()) {
        if ('id' in button && 'execute' in button) client.buttons.set(button.id, button);
        else createLogger.warn('One or more commands not contain "id" or "execute".');
    }

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        if (!interaction.client.buttons.get(interaction.customId)) return createLogger.error(`Error for run "${interaction.customId}"`);

        try {
            await interaction.client.buttons.get(interaction.customId).execute(interaction);
        } catch (erro) {
            if (interaction.replied || interaction.deferred) {
                createLogger.error(__filename, erro);
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                createLogger.error(__filename, erro);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
};
