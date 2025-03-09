const { Collection, Events, MessageFlags } = require('discord.js');
const { findCommands } = require('../class/fileExplorer');
const { createLogger } = require('../class/logger');

module.exports = (client) => {
    client.commands = new Collection();

    for (const command of findCommands()) {
        if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
        else createLogger.warn('One or more commands not contain "id" or "execute".');
    }

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.client.commands.get(interaction.commandName)) {
            return createLogger.error(`Error for run "${interaction.commandName}"`);
        }

        try {
            await interaction.client.commands.get(interaction.commandName).execute(interaction);
        } catch (error) {
            if (interaction.replied || interaction.deferred) {
                console.log(error);
                createLogger.error(__filename, error);
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                console.log(error);
                createLogger.error(__filename, error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    });
};
