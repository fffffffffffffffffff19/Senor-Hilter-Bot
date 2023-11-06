const { REST, Routes } = require('discord.js');
const fileExplorer = require('./src/handlers/fileExplorer');
require('dotenv').config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];

for (const command of fileExplorer('commands')) {
    if ('data' in command && 'execute' in command) commands.push(command.data.toJSON());
    else console.log('[WARNING] The one or more commands as missing a required "data" or "execute" property.');
}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
