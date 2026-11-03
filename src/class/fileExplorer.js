const fs = require('node:fs');
const path = require('node:path');

function findJavaScriptFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return findJavaScriptFiles(entryPath);
        return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
    });
}

function loadModules(directory) {
    return findJavaScriptFiles(directory).map((filePath) => require(filePath));
}

module.exports = {
    findButtons() {
        const directory = path.resolve(__dirname, '../buttons/scripts');
        return fs
            .readdirSync(directory)
            .filter((name) => name.endsWith('.js'))
            .map((name) => require(path.join(directory, name)))
            .filter((button) => button.id && button.execute);
    },
    findCommands() {
        return loadModules(path.resolve(__dirname, '../commands')).filter(
            (command) => command.data && command.execute,
        );
    },
    findEvents() {
        return loadModules(path.resolve(__dirname, '../events')).filter(
            (event) => event.name && event.execute,
        );
    },
    findHandlers() {
        return findJavaScriptFiles(path.resolve(__dirname, '../handlers'));
    },
};
