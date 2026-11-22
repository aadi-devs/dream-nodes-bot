const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const stagingDir = path.join(process.cwd(), 'emojis_staging');

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sanitizeDiscordName(name, isAnimated = false, idx = 0) {
  let clean = name.toLowerCase()
    // strip leading numeric IDs if followed by text (e.g. 259419darkbluearrow -> darkbluearrow)
    .replace(/^\d+([a-z_])/, '$1')
    .replace(/[~@#\$%\^&\*\(\)\+=\[\]\{\};:'",<>\?\/\\\|`!]/g, '_')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  // If pure numbers or empty/too short
  if (/^\d+$/.test(clean) || clean.length < 2) {
    clean = isAnimated ? `dn_anim_${idx}` : `dn_icon_${idx}`;
  }

  if (clean.length > 32) clean = clean.substring(0, 32).replace(/_+$/g, '');
  return clean;
}

function scanFiles(dir) {
  let res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      res = res.concat(scanFiles(full));
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (['.gif', '.png', '.webp'].includes(ext)) {
        res.push({
          fullPath: full,
          fileName: ent.name,
          baseName: path.parse(ent.name).name,
          ext,
          isAnimated: ext === '.gif',
          sizeBytes: fs.statSync(full).size
        });
      }
    }
  }
  return res;
}

function buildCatalog() {
  console.log('Scanning all files from user uploaded servers...');
  const files = scanFiles(stagingDir);

  // Filter out files > 256KB (Discord limit)
  const validFiles = files.filter(f => f.sizeBytes <= 256 * 1024);
  console.log(`Found ${files.length} files (${validFiles.length} valid under 256KB).`);

  // Sort: ANIMATED (.gif) FIRST, then static!
  validFiles.sort((a, b) => {
    if (a.isAnimated && !b.isAnimated) return -1;
    if (!a.isAnimated && b.isAnimated) return 1;
    return a.fileName.localeCompare(b.fileName);
  });

  const seenHashes = new Set();
  const seenNames = new Map();
  const catalog = [];

  validFiles.forEach((file, idx) => {
    const buf = fs.readFileSync(file.fullPath);
    const hash = sha256(buf);

    // Deduplicate identical images across zip files
    if (seenHashes.has(hash)) return;
    seenHashes.add(hash);

    let cleanName = sanitizeDiscordName(file.baseName, file.isAnimated, idx + 1);

    // If duplicate name, append suffix
    if (seenNames.has(cleanName)) {
      const count = seenNames.get(cleanName) + 1;
      seenNames.set(cleanName, count);
      cleanName = `${cleanName}_${count}`.substring(0, 32);
    } else {
      seenNames.set(cleanName, 1);
    }

    catalog.push({
      filePath: file.fullPath,
      discordName: cleanName,
      originalName: file.fileName,
      isAnimated: file.isAnimated,
      ext: file.ext,
      sizeBytes: file.sizeBytes
    });
  });

  const animatedCount = catalog.filter(e => e.isAnimated).length;
  const staticCount = catalog.filter(e => !e.isAnimated).length;

  console.log(`\nCurated Catalog Summary:`);
  console.log(`  Total Unique Emojis: ${catalog.length}`);
  console.log(`  Animated (.gif) [PRIORITY]: ${animatedCount}`);
  console.log(`  Static (.png/.webp): ${staticCount}`);

  const outPath = path.join(__dirname, 'clean_user_emojis_catalog.json');
  fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`Catalog saved to: ${outPath}`);
}

buildCatalog();
