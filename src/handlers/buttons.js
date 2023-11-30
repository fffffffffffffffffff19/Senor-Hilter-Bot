const { Collection, Events } = require('discord.js');
const { FileExplorer } = require('../tools/fileExplorer');

module.exports = (client) => {
    client.buttons = new Collection();

    for (const button of FileExplorer.findButtons()) {
        if ('id' in button && 'execute' in button) client.buttons.set(button.id, button);
        else console.log('[Warning] One or more commands not contain "id" or "execute".');
    }

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        if (!interaction.client.buttons.get(interaction.customId)) {
            console.log(`Error for run "${interaction.customId}"`);
            return;
        }

        try {
            await interaction.client.buttons.get(interaction.customId).execute(interaction);
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
