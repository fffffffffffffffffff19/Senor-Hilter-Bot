const { Events } = require('discord.js');
const logoCmd = require('../../assets/txt/logoCmd.js');
const botStatus = require('../../assets/txt/botStatus.js');
const clientConfig = require('../../../config.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await client.user.setUsername(clientConfig.clientUsername);
        // await client.user.setAvatar(clientConfig.avatarURL);
        // await client.user.setBanner(clientConfig.bannerURL);
        await client.user.setPresence({
            activities: [{ name: clientConfig.clientPresence }],
            status: clientConfig.clientStatus,
        });

        console.log(logoCmd);
        console.log(botStatus(clientConfig, client));
    },
};
