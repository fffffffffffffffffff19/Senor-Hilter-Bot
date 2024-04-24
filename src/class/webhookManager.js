const { client } = require('../main');

class WebhookManager {
    constructor() {
        this.createWebhook = async (channel) => {
            await channel.createWebhook({
                name: client.user.username,
                avatar: client.user.avatarURL(),
            });
        };

        this.editWebhook = async (webhook, channel, name, avatar) => {
            await webhook.edit({
                name,
                avatar,
                channel,
            });
        };

        this.fetchWebhook = async (channel) => {
            const webhooks = await channel.fetchWebhooks();
            return webhooks.find((webhook) => webhook.owner.id === '1171060823356084294'); // bot id
        };
    }
}

module.exports = new WebhookManager();
