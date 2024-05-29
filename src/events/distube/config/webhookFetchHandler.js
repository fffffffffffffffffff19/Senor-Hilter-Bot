const { playSong, addSong, addPlaylist } = require('../../../commands/music/config/response');

class WebhookFetchHandler {
    constructor() {
        this.Error = false;
        this.PlaySong = (webhook, song, gTemplate, buttons) => webhook.send({ embeds: [playSong(song, gTemplate.autoplay, gTemplate.paused)], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
        this.AddSong = (webhook, queue, gTemplate, buttons) => webhook.send({ embeds: [addSong(queue.songs[0], gTemplate.autoplay, gTemplate.paused)], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
        this.AddPlaylist = (webhook, queue, gTemplate, buttons) => webhook.send({ embeds: [addPlaylist(queue.songs[0], gTemplate.autoplay, gTemplate.paused)], components: [buttons] }).then((msg) => gTemplate.lastWebhookMenssageId = msg.id);
    }
}

module.exports = new WebhookFetchHandler();
