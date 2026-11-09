const { Events } = require('discord.js');
const logoCmd = require('../../assets/txt/logoCmd.js');
const botStatus = require('../../assets/txt/botStatus.js');
const clientConfig = require('../../../config.js');
const waitForLavalink = require('../../audio/waitForLavalink');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const node = client.lavalink?.nodeManager?.nodes?.get('primary');
        if (!node) throw new Error('The configured Lavalink node "primary" was not created.');

        await waitForLavalink(node);
        await client.lavalink.init({
            id: client.user.id,
            username: client.user.username,
        });
        await client.user.setPresence({
            activities: [{ name: clientConfig.clientPresence }],
            status: clientConfig.clientStatus,
        });

        console.log(logoCmd);
        console.log(botStatus(clientConfig, client));
    },
};
