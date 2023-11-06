const fileExplorer = require('./fileExplorer');

module.exports = (client) => {
    for (const event of fileExplorer('events')) {
        if (event.once) client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }
};
