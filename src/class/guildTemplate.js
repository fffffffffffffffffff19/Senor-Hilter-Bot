const { client } = require('../main');

class GuildTemplate {
    constructor() {
        this.guildMapFetch = (guildId) => client.guildConfig.has(guildId);
        this.guildMapGet = (guildId) => client.guildConfig.get(guildId);
        this.guildMapDelete = (guildId) => client.guildConfig.delete(guildId);
        this.guildMapCreate = (guildId) => client.guildConfig.set(guildId, {
            lastWebhookMenssageId: null,
            paused: null,
            stop: null,
            autoplay: null,
            skipManual: null,
        });
        this.teste = () => client.guildConfig;
    }
}

module.exports = new GuildTemplate();
