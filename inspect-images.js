const sizeOf = require('image-size');
const path = require('path');

const files = [
  'public/arcigy-logo-official.png',
  'public/arcigy-wordmark-footer.png'
];

files.forEach(file => {
  try {
    const dimensions = sizeOf(path.join(process.cwd(), file));
    console.log(`${file}: ${dimensions.width}x${dimensions.height}`);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
