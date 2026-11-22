const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const userUploadsDir = 'C:/Users/suman/.gemini/antigravity/brain/665e6595-2842-48ae-8678-cd5b7e9e7121/.user_uploaded';
const stagingDir = path.join(process.cwd(), 'emojis_staging');
if (!fs.existsSync(stagingDir)) fs.mkdirSync(stagingDir, { recursive: true });

const files = fs.readdirSync(userUploadsDir).filter(f => f.endsWith('.zip'));
console.log('Zip files found in user uploads:', files);

files.forEach(zipFile => {
  const zipPath = path.join(userUploadsDir, zipFile);
  const targetSubDir = path.join(stagingDir, zipFile.replace('.zip', ''));
  if (!fs.existsSync(targetSubDir)) fs.mkdirSync(targetSubDir, { recursive: true });
  console.log(`Extracting ${zipFile} to ${targetSubDir}...`);
  try {
    execSync(`tar -xf "${zipPath}" -C "${targetSubDir}"`);
    console.log(`✓ Successfully extracted ${zipFile}`);
  } catch (e) {
    console.error(`✗ Error extracting ${zipFile}:`, e.message);
  }
});
