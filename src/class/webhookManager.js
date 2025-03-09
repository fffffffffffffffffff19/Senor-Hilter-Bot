const { client } = require('../main');

class WebhookManager {
    constructor() {
        this.createWebhook = async (channel) => {
            await channel.createWebhook({ name: client.user.username, avatar: client.user.avatarURL() });
        };

        this.editWebhook = async (webhook, channel, name, avatar) => {
            await webhook.edit({ name, avatar, channel });
        };

        this.getWebhook = async (channel) => {
            const webhook = await channel.fetchWebhooks();
            return webhook.find((webhook) => webhook.owner.id === client.user.id);
        };

        this.fetchWebhook = async (channel) => {
            const webhook = await channel.fetchWebhooks();
            return webhook.find((webhook) => webhook.owner.id === client.user.id) ? true : false;
        };
    }
}

module.exports = new WebhookManager();
