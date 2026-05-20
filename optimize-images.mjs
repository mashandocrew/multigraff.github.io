import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const INPUT_DIR  = './assets/images';
const OUTPUT_DIR = './assets/images/webp';

// Hero necesita más resolución, el resto de la galería con 900px alcanza
const HERO_MAX   = 1920;
const DEFAULT_MAX = 900;
const QUALITY    = 82;

const HERO_FILES = ['Paleta_Hero.jpg'];

async function run() {
  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(INPUT_DIR)).filter(f =>
    /\.(jpe?g|png|webp)$/i.test(f)
  );

  console.log(`\nProcesando ${files.length} imágenes → WebP (calidad ${QUALITY})...\n`);

  let totalBefore = 0;
  let totalAfter  = 0;

  for (const file of files) {
    const inputPath  = path.join(INPUT_DIR, file);
    const outputName = file.replace(/\.(jpe?g|png|webp)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);

    const maxWidth = HERO_FILES.includes(file) ? HERO_MAX : DEFAULT_MAX;

    try {
      const { size: sizeBefore } = await import('fs').then(m =>
        m.promises.stat(inputPath)
      );

      await sharp(inputPath)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(outputPath);

      const { size: sizeAfter } = await import('fs').then(m =>
        m.promises.stat(outputPath)
      );

      const pct = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(0);
      const kb  = n => (n / 1024).toFixed(0).padStart(6);

      console.log(
        `  ✓ ${file.padEnd(36)} ${kb(sizeBefore)} KB → ${kb(sizeAfter)} KB  (-${pct}%)`
      );

      totalBefore += sizeBefore;
      totalAfter  += sizeAfter;
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  const saved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  const mb    = n => (n / 1024 / 1024).toFixed(1);

  console.log(`\n${'─'.repeat(62)}`);
  console.log(`  Total original : ${mb(totalBefore)} MB`);
  console.log(`  Total optimizado: ${mb(totalAfter)} MB`);
  console.log(`  Ahorro          : ${mb(totalBefore - totalAfter)} MB  (${saved}%)`);
  console.log(`\n  Imágenes listas en: ${OUTPUT_DIR}\n`);
}

run();
