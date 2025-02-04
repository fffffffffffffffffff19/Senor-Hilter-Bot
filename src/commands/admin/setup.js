const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { guildCreate, guildFetch, guildGet, guildUpdate } = require('../../class/guildTemplate');
const { clientUsername } = require('../../../config');
const { createWebhook, fetchWebhook, getWebhook } = require('../../class/webhookManager');
const { row1, row2 } = require('../../buttons/creating/playerButtons');
const playerEmbed = require('../../assets/embeds/playerEmbed');

module.exports = {
    data: new SlashCommandBuilder().setName('setup').setDescription('create a music channel.'),
    async execute(interaction) {
        await interaction.deferReply();

        const guild = interaction.guild;
        const guildChannel = guild.channels;
        const guildId = guild.id;
        // creating a new guild config on db
        if (!(await guildFetch(guildId))) await guildCreate(guildId);

        const guildConfig = await guildGet(guildId);
        // checking if have player channel on db or if player channel exists on guild
        if (!guildConfig.textChannel || !(await guildChannel.cache.get(guildConfig.textChannel))) {
            // creating new player channel
            return await guild.channels
                .create({ name: `${clientUsername}-music`, type: ChannelType.GuildText })
                .then(async (newChannel) => {
                    await newChannel.permissionOverwrites.set([
                        {
                            id: guild.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.UseApplicationCommands,
                            ],
                        },
                    ]);
                    // creating webhook
                    await createWebhook(newChannel);
                    const webhook = await getWebhook(newChannel);
                    // sending player embed and buttons
                    await webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(
                        async (webhookMessage) =>
                            await guildUpdate({
                                guildId: guildId,
                                textChannel: newChannel,
                                webhookMessage: webhookMessage,
                            }),
                    );

                    await interaction.editReply({
                        content: `A new music text channel as been created (<#${newChannel.id}>)`,
                        ephemeral: true,
                    });
                });
        }

        const channel = await guildChannel.cache.get(guildConfig.textChannel);
        const checkWebhook = await fetchWebhook(channel);
        // checking if webhook exists on channel
        if (!checkWebhook) await createWebhook(channel);
        // checking if player embed exists on channel
        let toReturn;
        const webhook = await getWebhook(channel);
        await webhook.fetchMessage(guildConfig.webhookMessage).catch(async () => {
            await webhook.send({ embeds: [playerEmbed()], components: [row1, row2] }).then(
                async (webhookMessage) =>
                    await guildUpdate({
                        guildId: guildId,
                        textChannel: channel,
                        webhookMessage: webhookMessage,
                    }),
            );

            await interaction.editReply({
                content: `A new player message as beem created on <#${channel.id}>`,
                ephemeral: true,
            });

            return (toReturn = true);
        });

        if (toReturn) return;

        await interaction.editReply({
            content: `There is already a music text channel. (<#${channel.id}>)`,
            ephemeral: true,
        });
    },
};
