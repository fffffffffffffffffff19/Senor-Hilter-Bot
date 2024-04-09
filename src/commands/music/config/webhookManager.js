const client = require('../../../../app');

class WebhookManager {
    static createWebhook = async (channel) => {
        await channel.createWebhook({
            name: client.user.username,
            avatar: client.user.avatarURL(),
        });
    };

    static thiseditWebhook = async (webhook, _channel, _name, _avatar) => {
        await webhook.edit({
            name: _name,
            avatar: _avatar,
            channel: _channel,
        });
    };

    static fetchWebhook = async (channel) => {
        const webhooks = await channel.fetchWebhooks();
        return webhooks.find((_webhook) => _webhook.owner.id === '1171060823356084294');
    };
}

module.exports = { WebhookManager };
