const { findEvents } = require('../tools/fileExplorer');

module.exports = (client) => {
    for (const event of findEvents()) {
        if (!event.name) return;
        if (event.once) client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }
};
