module.exports = (clientConfig, client) => {
    return `  Username: ${clientConfig.clientUsername}\n  Presence: ${clientConfig.clientPresence}\n  On ${client.guilds.cache.size} servers`;
};
