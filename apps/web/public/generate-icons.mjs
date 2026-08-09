// generate-icons.mjs
// Converts securevoyage-logo.svg → all required PWA icon PNGs
// Run: node generate-icons.mjs
// Requires: npm install sharp (dev dependency)

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let sharp;
try {
  const require = createRequire(import.meta.url);
  sharp = require('sharp');
} catch {
  console.error('❌  sharp not found. Installing...');
  console.error('   Run: npm install --save-dev sharp');
  process.exit(1);
}

const svgPath = path.join(__dirname, 'securevoyage-logo.svg');
const svgBuffer = readFileSync(svgPath);

const icons = [
  { name: 'favicon-16x16.png',    size: 16  },
  { name: 'favicon-32x32.png',    size: 32  },
  { name: 'icon-192.png',         size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-512.png',         size: 512 },
  // Maskable icon — same SVG rendered on a solid navy background with ~10% safe-zone padding
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
];

async function generateAll() {
  console.log('🎨  Generating SecureVoyage PWA icons...\n');

  for (const icon of icons) {
    const outPath = path.join(__dirname, icon.name);

    if (icon.maskable) {
      // Maskable: place the icon on a solid dark navy background
      // The SVG is scaled to 80% to respect the safe zone
      const bgSize = icon.size;
      const iconSize = Math.round(bgSize * 0.8);
      const offset = Math.round((bgSize - iconSize) / 2);

      const iconBuffer = await sharp(svgBuffer)
        .resize(iconSize, iconSize)
        .png()
        .toBuffer();

      await sharp({
        create: {
          width: bgSize,
          height: bgSize,
          channels: 4,
          background: { r: 13, g: 27, b: 42, alpha: 1 }, // #0D1B2A
        },
      })
        .composite([{ input: iconBuffer, top: offset, left: offset }])
        .png()
        .toFile(outPath);

    } else {
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outPath);
    }

    console.log(`  ✅  ${icon.name.padEnd(28)} ${icon.size}x${icon.size}`);
  }

  console.log('\n🎉  All icons generated in apps/web/public/');
  console.log('📝  Make sure manifest.json references icon-maskable-512.png with purpose: "maskable"');
}

generateAll().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
