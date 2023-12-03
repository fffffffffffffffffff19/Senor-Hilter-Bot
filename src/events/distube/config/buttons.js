const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const stopButton = new ButtonBuilder()
    .setCustomId('stopButton')
    .setEmoji('<:stop:1179078026328281208>')
    .setStyle(ButtonStyle.Secondary);

const pausedButton = new ButtonBuilder()
    .setCustomId('pausedButton')
    .setEmoji('<:pause:1179059434014654494>')
    .setStyle(ButtonStyle.Secondary);

const skipButton = new ButtonBuilder()
    .setCustomId('skipButton')
    .setEmoji('<:skip:1179078031978016778>')
    .setStyle(ButtonStyle.Secondary);

const autoplayButton = new ButtonBuilder()
    .setCustomId('autoplayButton')
    .setEmoji('<:autoplay:1179078030342242315>')
    .setStyle(ButtonStyle.Secondary);

const shuffleButton = new ButtonBuilder()
    .setCustomId('shuffleButton')
    .setEmoji('<:shuffle:1180889890469195846>')
    .setStyle(ButtonStyle.Secondary);

const buttons = new ActionRowBuilder()
    .addComponents(stopButton, pausedButton, skipButton, autoplayButton, shuffleButton);

module.exports = { buttons };
