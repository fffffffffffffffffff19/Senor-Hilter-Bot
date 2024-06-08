class EmbedResolver {
    constructor() {
        this.lastMsgChecker = async (gTemplate, embedResolver, webhook, song, buttons, Error) => {
            if (gTemplate.lastWebhookMenssageId === null) return embedResolver(webhook, song, gTemplate, buttons);

            const lastMsg = await webhook.fetchMessage(gTemplate.lastWebhookMenssageId).catch(async () => {
                await embedResolver(webhook, song, gTemplate, buttons);

                Error = true;
            });

            if (Error) return Error = false;

            return lastMsg;
        };

        this.editEmbed = async (gTemplate, embedResolver, embedReturned, webhook, song, buttons, Error) => {
            await webhook.editMessage(
                await this.lastMsgChecker(gTemplate, embedResolver, webhook, song, buttons, Error),
                { embeds: [embedReturned(song, gTemplate.autoplay, gTemplate.paused)], components: [buttons] },
            );
        };
    }
}

module.exports = new EmbedResolver();
