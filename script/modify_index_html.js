const fs = require('fs');
const path = require('path');

const buildPath = path.resolve(__dirname, '../unpackage/dist/build/web');
const indexPath = path.join(buildPath, 'index.html');

console.log(`Modifying ${indexPath} for PWA...`);

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading index.html: ${err}`);
    return;
  }

  // 1. Add manifest link to head
  const manifestLink = `    <link rel="manifest" href="manifest.json" />`;
  let modifiedData = data.replace('</head>', `${manifestLink}\n  </head>`);

  // 2. Add service worker registration script before </body>
  const swRegistrationScript = `
    <script>
      const registerServiceWorker = async () => {
        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.register("/sw.js", {
              scope: "/",
            });
            if (registration.installing) {
              console.log("Service worker installing");
            } else if (registration.waiting) {
              console.log("Service worker installed");
            } else if (registration.active) {
              console.log("Service worker active");
            }
          } catch (error) {
            console.error(\`Registration failed with \${error}\`);
          }
        }
      };
      registerServiceWorker();
    </script>
`;
  modifiedData = modifiedData.replace('</body>', `${swRegistrationScript}\n  </body>`);

  fs.writeFile(indexPath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing index.html: ${err}`);
      return;
    }
    console.log('index.html modified successfully for PWA.');
  });
});
