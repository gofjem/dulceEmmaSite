import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const DIRS = ['public/images', 'public']
const EXTS = new Set(['.png', '.jpg', '.jpeg'])
const QUALITY = 82

for (const dir of DIRS) {
  const files = await readdir(dir).catch(() => [])
  for (const file of files) {
    if (!EXTS.has(extname(file).toLowerCase())) continue
    const src = join(dir, file)
    const dest = join(dir, basename(file, extname(file)) + '.webp')
    const [srcStat, destStat] = await Promise.all([stat(src), stat(dest).catch(() => null)])
    if (destStat && destStat.mtimeMs > srcStat.mtimeMs) { console.log(`skip  ${dest}`); continue }
    const info = await sharp(src).webp({ quality: QUALITY }).toFile(dest)
    console.log(`✓ ${src} → ${dest}  (${Math.round(srcStat.size / 1024)}KB → ${Math.round(info.size / 1024)}KB)`)
  }
}
