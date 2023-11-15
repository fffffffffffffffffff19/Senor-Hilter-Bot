const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('My command list'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('__All my commands__')
            .addFields(
                {
                    name: '`/play <link>`',
                    value: '_Play the sound from the link._',
                    inline: true,
                },
                {
                    name: '`/skip`',
                    value: '_Skip to the next song._',
                    inline: true,
                },
                {
                    name: '`/queue`',
                    value: '_Display the playlist sounds._',
                    inline: true,
                },
                {
                    name: '`/autoplay`',
                    value: '_Automatically plays songs of the same genre._',
                    inline: true,
                },
                {
                    name: '`/stop`',
                    value: '_Stop playing music and make the bot leave the channel._',
                    inline: true,
                },
            )
            .setThumbnail('https://cdn.discordapp.com/avatars/1171060823356084294/cef18a76e9d6c1d4ec1b41362c544568.png?size=4096')
            .setColor('#00b0f4')
            .setFooter({
                text: 'fffffffffffffffs',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
