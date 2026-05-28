import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// We will use the existing icon-512x512.png (which is a JPEG/JFIF) as the high-quality source for all icons!
const sourceIconPath = path.join(iconsDir, 'icon-512x512.png');

const targets = [
  { file: 'icon-72x72.png', size: 72 },
  { file: 'icon-96x96.png', size: 96 },
  { file: 'icon-128x128.png', size: 128 },
  { file: 'icon-144x144.png', size: 144 },
  { file: 'icon-192x192.png', size: 192 },
  { file: 'icon-384x384.png', size: 384 },
  { file: 'icon-512x512.png', size: 512 },
  { file: 'maskable-icon-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 }
];

async function fixIcons() {
  console.log('--- Loading Source Icon ---');
  const sourceImage = await Jimp.read(sourceIconPath);
  console.log('Source loaded successfully.');

  for (const target of targets) {
    const destPath = path.join(iconsDir, target.file);
    console.log(`Resizing and converting to actual PNG: ${target.file} (${target.size}x${target.size})...`);
    
    // Create a clone, resize, and write (specifying PNG format extension guarantees it writes as a PNG!)
    const cloned = sourceImage.clone();
    cloned.resize({ w: target.size, h: target.size });
    await cloned.write(destPath);
  }

  console.log('--- Converting Screenshots to Valid PNGs ---');
  const mobileScreenshotPath = path.join(iconsDir, 'screenshot-mobile.png');
  const desktopScreenshotPath = path.join(iconsDir, 'screenshot-desktop.png');

  console.log('Converting mobile screenshot...');
  const mobileImg = await Jimp.read(mobileScreenshotPath);
  await mobileImg.write(mobileScreenshotPath); // Overwrite with true PNG encoding

  console.log('Converting desktop screenshot...');
  const desktopImg = await Jimp.read(desktopScreenshotPath);
  await desktopImg.write(desktopScreenshotPath); // Overwrite with true PNG encoding

  console.log('--- ALL PWA ASSETS SUCCESSFULLY FIXED! ---');
}

fixIcons().catch(console.error);
