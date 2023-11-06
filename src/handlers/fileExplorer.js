const fs = require('node:fs');
const path = require('node:path');

module.exports = (itemsExport) => {
    const foldersPath = path.join(__dirname, `../${itemsExport}`);
    const itemsFolders = fs.readdirSync(foldersPath);
    const items = [];

    for (const folder of itemsFolders) {
        const itemsPath = path.join(foldersPath, folder);
        const itemsFile = fs.readdirSync(itemsPath).filter((item) => item.endsWith('.js'));

        for (const item of itemsFile) {
            const itemPath = path.join(itemsPath, item);
            const importedItems = require(itemPath);

            items.push(importedItems);
        }
    }
    return items;
};
