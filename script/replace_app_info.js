const fs = require('fs');
const path = require('path');

const targetDirectory = path.join(__dirname, '../unpackage/dist/build/web/assets');
const searchRegex = /(appId:"__UNI__[^"]*",appName:"[^"]*")/g;
const replacement = 'appId:"__UNI__1G25D82",appName:"test"';

function findAndReplaceInFiles(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        findAndReplaceInFiles(fullPath); // Recurse into subdirectories
      } else if (entry.isFile() && entry.name.startsWith('index') && entry.name.endsWith('.js')) {
        console.log(`Processing file: ${fullPath}`);
        fs.readFile(fullPath, 'utf8', (readErr, data) => {
          if (readErr) {
            console.error(`Error reading file ${fullPath}:`, readErr);
            return;
          }

          if (data.match(searchRegex)) {
            const result = data.replace(searchRegex, replacement);
            fs.writeFile(fullPath, result, 'utf8', (writeErr) => {
              if (writeErr) {
                console.error(`Error writing to file ${fullPath}:`, writeErr);
              } else {
                console.log(`Successfully replaced content in ${fullPath}.`);
                // Since the task requires only one replacement, we can exit after the first success
                process.exit(0);
              }
            });
          } else {
            console.log(`No match found in ${fullPath}.`);
          }
        });
      }
    }
  });
}

console.log(`Starting search and replace in ${targetDirectory}...`);
findAndReplaceInFiles(targetDirectory);
