const { Collection, Events } = require('discord.js');
const { FileExplorer } = require('../tools/fileExplorer');

module.exports = (client) => {
    client.commands = new Collection();

    for (const command of FileExplorer.findCommands()) {
        if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
        else console.log('[Warning] One or more commands not contain "data" or "execute".');
    }

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.client.commands.get(interaction.commandName)) {
            console.log(`Error for run "${interaction.commandName}"`);
            return;
        }

        try {
            await interaction.client.commands.get(interaction.commandName).execute(interaction);
        } catch (error) {
            if (interaction.replied || interaction.deferred) {
                console.log(error);
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                console.log(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
};
