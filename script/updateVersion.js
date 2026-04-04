const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../manifest.json');

fs.readFile(manifestPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading manifest.json:', err);
        return;
    }

    try {
        // Remove comments from the JSON string before parsing
        const cleanData = data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '');
        const manifest = JSON.parse(cleanData);

        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        const dateTime = `${year}${month}${day}.${hours}${minutes}`;
        const versionCode = manifest.versionCode;

        manifest.versionName = `${dateTime}.${versionCode}`;

        fs.writeFile(manifestPath, JSON.stringify(manifest, null, "\t"), 'utf8', (err) => {
            if (err) {
                console.error('Error writing manifest.json:', err);
                return;
            }
            console.log(`manifest.json versionName updated to: ${manifest.versionName}`);
        });

    } catch (parseErr) {
        console.error('Error parsing manifest.json:', parseErr);
    }
});
