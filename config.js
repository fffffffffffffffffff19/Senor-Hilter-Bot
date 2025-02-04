const cookiesFetch = require('./src/func/cookiesFetch');

module.exports = {
    /* Bot info */
    clientUsername: 'Señor Hilter', // bot username
    clientStatus: 'online', // bot status (idle, online, dnd)
    clientPresence: '/help for all commands', // bot presence
    avatarURL: 'https://i.imgur.com/bIZX65l.png', // bot avatar
    bannerURL: 'https://i.imgur.com/VtSr3Lf.png', // bot banner
    /* Player Embed */
    imageURL: 'https://i.imgur.com/zMl6N34.gif', // main embed image
    color: '#a626a6', // main embed color (need HEX code "#FFFFFF")
    /* Cookie Resolver */
    cookie: cookiesFetch(), // used if you want to play mature videos on yt
    /* Buttons Emojis */
    buttonsEmojis: {
        previosButton: '<:previos:1273336377538379809>',
        pausedButton: '<:pause:1179059434014654494>',
        addToPlaylistButton: '<:addToPlaylist:1273341154225557556>',
        stopButton: '<:stop:1179078026328281208>',
        nextButton: '<:skip:1179078031978016778>',
        shuffleButton: '<:shuffle:1180889890469195846>',
        autoplayButton: '<:autoplay:1179078030342242315>',
        profileButton: '<:profile:1273336378943475772>',
        repeatButton: '<:loop:1273336376128962570>',
        helpButton: '<:help:1179078028911976590>',
    },
    /* Embed Images */
    embedImages: [
        'https://i.imgur.com/ZBeMLxv.gif',
        'https://i.imgur.com/n5tkLCv.gif',
        'https://i.imgur.com/fpOrimK.gif',
        'https://i.imgur.com/rxePXCl.gif',
        'https://i.imgur.com/OXVFnS0.gif',
        'https://i.imgur.com/J8nhnlJ.gif',
        'https://i.imgur.com/WW1b6IA.gif',
        'https://i.imgur.com/oG9E2sC.gif',
        'https://i.imgur.com/Ktgb4Si.gif',
    ],
};
