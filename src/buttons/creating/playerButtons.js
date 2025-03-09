const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { buttonsEmojis } = require('../../../config');

const previosButton = new ButtonBuilder()
    .setCustomId('previosButton')
    .setEmoji(buttonsEmojis?.previosButton || '⏮️')
    .setStyle(ButtonStyle.Secondary);

const pausedButton = new ButtonBuilder()
    .setCustomId('pausedButton')
    .setEmoji(buttonsEmojis?.pausedButton || '⏯️')
    .setStyle(ButtonStyle.Secondary);

const addToPlaylistButton = new ButtonBuilder()
    .setCustomId('addToPlaylistButton')
    .setEmoji(buttonsEmojis?.addToPlaylistButton || '📥')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

const stopButton = new ButtonBuilder()
    .setCustomId('stopButton')
    .setEmoji(buttonsEmojis?.stopButton || '⏹️')
    .setStyle(ButtonStyle.Secondary);

const nextButton = new ButtonBuilder()
    .setCustomId('nextButton')
    .setEmoji(buttonsEmojis?.nextButton || '⏭️')
    .setStyle(ButtonStyle.Secondary);

const row1 = new ActionRowBuilder().addComponents(
    previosButton,
    pausedButton,
    addToPlaylistButton,
    stopButton,
    nextButton,
);

const shuffleButton = new ButtonBuilder()
    .setCustomId('shuffleButton')
    .setEmoji(buttonsEmojis?.shuffleButton || '🔀')
    .setStyle(ButtonStyle.Secondary);

const autoplayButton = new ButtonBuilder()
    .setCustomId('autoplayButton')
    .setEmoji(buttonsEmojis?.autoplayButton || '🔃')
    .setStyle(ButtonStyle.Secondary);

const profileButton = new ButtonBuilder()
    .setCustomId('profileButton')
    .setEmoji(buttonsEmojis?.profileButton || '👤')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

const repeatButton = new ButtonBuilder()
    .setCustomId('repeatButton')
    .setEmoji(buttonsEmojis?.repeatButton || '🔁')
    .setStyle(ButtonStyle.Secondary);

const helpButton = new ButtonBuilder()
    .setCustomId('helpButton')
    .setEmoji(buttonsEmojis?.helpButton || '❓')
    .setStyle(ButtonStyle.Secondary);

const row2 = new ActionRowBuilder().addComponents(
    shuffleButton,
    autoplayButton,
    profileButton,
    repeatButton,
    helpButton,
);

module.exports = { row1, row2 };
