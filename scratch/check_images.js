const fs = require('fs');
const path = require('path');

function getHeaderHex(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    return buffer.slice(0, 16).toString('hex').toUpperCase();
  } catch (e) {
    return e.message;
  }
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const files = fs.readdirSync(iconsDir);

console.log('--- Checking File Headers ---');
files.forEach((file) => {
  const filePath = path.join(iconsDir, file);
  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    const hex = getHeaderHex(filePath);
    console.log(`${file}: size=${stat.size} bytes, hex=${hex}`);
  }
});
