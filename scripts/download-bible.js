/**
 * Script to download KJV Bible JSON
 * Run with: node scripts/download-bible.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BIBLE_URL = 'https://raw.githubusercontent.com/j0n777/bibledb/main/english-kjv-normalized.json';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'bible', 'kjv.json');

console.log('📖 Downloading KJV Bible JSON...');
console.log(`Source: ${BIBLE_URL}`);
console.log(`Destination: ${OUTPUT_PATH}`);

// Create assets/bible directory if it doesn't exist
const dir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`✅ Created directory: ${dir}`);
}

// Download the file
const file = fs.createWriteStream(OUTPUT_PATH);

https.get(BIBLE_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`❌ Failed to download: HTTP ${response.statusCode}`);
    process.exit(1);
  }

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    const stats = fs.statSync(OUTPUT_PATH);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Download complete! File size: ${fileSizeMB} MB`);
    console.log(`📍 Saved to: ${OUTPUT_PATH}`);
  });
}).on('error', (err) => {
  fs.unlink(OUTPUT_PATH, () => {});
  console.error(`❌ Download failed: ${err.message}`);
  process.exit(1);
});
