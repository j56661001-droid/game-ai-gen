const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE_PATH = 'static/icons/welcome@2x.png';
const OUTPUT_DIR = 'static/pwa_icons';

const iconSizes = [48, 72, 96, 144, 168, 192];
const screenshotSizes = [
  { width: 2398, height: 1636, name: 'screenshot-desktop.png', form_factor: 'wide' },
  { width: 708, height: 1300, name: 'screenshot-mobile.png', form_factor: 'narrow' }
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// Generate icons
iconSizes.forEach(size => {
  const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
  const command = `magick convert ${SOURCE_IMAGE_PATH} -resize ${size}x${size} ${outputPath}`;
  try {
    execSync(command);
    console.log(`Generated icon: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating icon ${outputPath}: ${error.message}`);
  }
});


console.log('Image generation complete.');
