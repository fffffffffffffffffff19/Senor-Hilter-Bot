const { Events, Routes, DataResolver } = require('discord.js');
const { clientConfig } = require('../../../config');
const { createLogger, fileName } = require('../../tools/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            await client.user.setUsername(clientConfig.clientUsername);
            await client.user.setAvatar(clientConfig.avatarURL);
            await client.user.setPresence({ activities: [{ name: clientConfig.clientPresence }], status: clientConfig.clientStatus });
            await client.rest.patch(Routes.user(), { body: { banner: await DataResolver.resolveImage(clientConfig.bannerURL) } });

            const txt = `
   ┏┓          ┓┏•┓     
   ┗┓┏┓┏┓┏┓┏┓  ┣┫┓┃╋┏┓┏┓
   ┗┛┗ ┛┗┗┛┛   ┛┗┗┗┗┗ ┛ 
`;

            console.log(txt);
            console.log(`  Username: ${clientConfig.clientUsername}\n  Presence: ${clientConfig.clientPresence}\n  On ${client.guilds.cache.size} servers`);
        } catch (erro) { createLogger.error(fileName, erro); }
    },
};
