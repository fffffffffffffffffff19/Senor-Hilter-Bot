const { REST, Routes } = require('discord.js');
const { fileExplorer } = require('./src/handlers/tools/fileExplorer');
require('dotenv').config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];

for (const command of fileExplorer('commands')) {
    console.log(command);
}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

        return console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
