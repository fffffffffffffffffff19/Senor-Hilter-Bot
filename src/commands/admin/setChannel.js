const { row1, row2 } = require('../../buttons/creating/playerButtons');
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { guildUpdate, guildCreate, guildGet, guildFetch } = require('../../class/guildTemplate');
const { fetchWebhook, getWebhook, createWebhook } = require('../../class/webhookManager');
const playerEmbed = require('../../assets/embeds/playerEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('set a new channel for the bot')
        .addChannelOption((option) => option.setName('channel').setDescription('Text Channel').setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        const guildChannel = guild.channels;
        const guildId = guild.id;
        const channelOption = interaction.options.getChannel('channel');
        // checking if the guild have config on db
        if (!(await guildFetch(guildId))) await guildCreate(guildId);
        // checking if user selected channel are textChannel based
        if (channelOption.type !== ChannelType.GuildText) {
            return await interaction.reply({
                content: 'Invalid channel, only text channel is allowed.',
                ephemeral: true,
            });
        }

        const guildConfig = await guildGet(guildId);
        const oldTextChannel = guildConfig.textChannel;
        const oldWebhookMessage = guildConfig.webhookMessage;
        // checking if the textchannel on db is the same selected by user
        if (oldTextChannel === channelOption.id) {
            return interaction.reply({ content: 'This channel already as selected', ephemeral: true });
        }
        // checking if have old bot player message
        if (oldWebhookMessage) {
            // checking if the old text channel still exists
            if (!guildConfig.textChannel || (await guildChannel.cache.get(guildConfig.textChannel))) {
                const oldChannel = await guildChannel.cache.get(guildConfig.textChannel);

                await oldChannel.messages.fetch(oldWebhookMessage).then(async (message) => message.delete());

                await guildUpdate({ guildId: guildId, webhookMessage: null });
            }
            // if not will update the db with null
            await guildUpdate({ guildId: guildId, textChannel: null, webhookMessage: null });
        }
        // checking if on selected channel have webhook
        if (!(await fetchWebhook(channelOption))) await createWebhook(channelOption);

        const webhook = await getWebhook(channelOption);

        // sending a new menssage and updating then on db
        await webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(async (webhookMessage) => {
            await guildUpdate({
                guildId: guildId,
                textChannel: channelOption,
                webhookMessage: webhookMessage,
            });
        });

        await interaction.reply({
            content: `A new bot player as created on <#${channelOption.id}>`,
            ephemeral: true,
        });
    },
};
