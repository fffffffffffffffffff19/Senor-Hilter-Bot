const client = require('../../../../app');

class WebhookManager {
    static async createWebhook(channel) {
        await channel.createWebhook({
            name: client.user.username,
            avatar: client.user.avatarURL(),
        });
    }

    static async editWebhook(webhook, _channel, _name, _avatar) {
        await webhook.edit({
            name: _name,
            avatar: _avatar,
            channel: _channel,
        });
    }

    static async fetchWebhook(channel) {
        const webhooks = await channel.fetchWebhooks();
        return webhooks.find((_webhook) => _webhook.owner.id === '1171060823356084294');
    }
}

module.exports = { WebhookManager };
