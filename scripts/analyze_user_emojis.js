const fs = require('fs');
const path = require('path');

const stagingDir = path.join(process.cwd(), 'emojis_staging');

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (['.gif', '.png', '.jpg', '.webp'].includes(ext)) {
        const stats = fs.statSync(fullPath);
        results.push({
          fullPath,
          fileName: item.name,
          ext,
          isAnimated: ext === '.gif',
          sizeBytes: stats.size,
          folder: path.basename(path.dirname(fullPath))
        });
      }
    }
  }
  return results;
}

const allFiles = scanDir(stagingDir);
const animated = allFiles.filter(f => f.isAnimated);
const staticFiles = allFiles.filter(f => !f.isAnimated);

console.log(`Total extracted files: ${allFiles.length}`);
console.log(`  Animated (.gif): ${animated.length}`);
console.log(`  Static (.png/.webp): ${staticFiles.length}`);

// Group by name
const nameMap = new Map();
allFiles.forEach(f => {
  const baseName = path.parse(f.fileName).name;
  if (!nameMap.has(baseName)) nameMap.set(baseName, []);
  nameMap.get(baseName).push(f);
});

console.log(`Unique base names: ${nameMap.size}`);

// Print animated samples
console.log('\nSample Animated Emojis:');
animated.slice(0, 30).forEach((f, idx) => {
  console.log(`  ${idx + 1}. [${(f.sizeBytes / 1024).toFixed(1)} KB] ${f.fileName}`);
});
