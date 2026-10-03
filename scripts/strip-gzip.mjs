/** Prepare a built web dist for native packaging (Electron / Capacitor).
 * Android's asset merger treats body-N.bin and body-N.bin.gz as duplicate
 * resources, and dropping the pre-compressed copies keeps installers smaller.
 * We therefore ship only the raw .bin payloads and remove the gzip field from
 * atlas.json so the renderer fetches the uncompressed files directly — this
 * also works on older WebViews without DecompressionStream. */
import {readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const webDir = process.argv[2];
if (!webDir) {
  console.error('usage: node scripts/strip-gzip.mjs <web-dir>');
  process.exit(1);
}

const modelsDir = join(webDir, 'models');
let removed = 0;
for (const name of readdirSync(modelsDir)) {
  if (name.endsWith('.gz')) {
    rmSync(join(modelsDir, name));
    removed++;
  }
}

const atlasPath = join(modelsDir, 'atlas.json');
const atlas = JSON.parse(readFileSync(atlasPath, 'utf8'));
for (const chunk of atlas.chunks) {
  delete chunk.gzip;
  delete chunk.gzipBytes;
}
writeFileSync(atlasPath, JSON.stringify(atlas));
console.log(`stripped ${removed} .gz payloads and gzip fields from ${atlasPath}`);
