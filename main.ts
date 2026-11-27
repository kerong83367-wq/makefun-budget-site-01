// HomeLedger's hand-in program (Node 22, standard library only). The site is
// the plain static files in app/ beside this file: index.html, one stylesheet,
// and ES modules that hold the household's data, state and views. Nothing in
// app/ loads over the network, and there is no build step.
//
// Running this program copies app/ and screenshots/ into the output directory
// and writes dossier.json there, using the vendored make.fun library to build
// it. The dossier is the summary the judge reads: the screenshots, the first
// load's files and bytes, and the site's source. vendor/makefun-frontend.ts
// must stay exactly as the kit shipped it, or the scorer's own copy will
// produce different bytes and the entry fails its dossier check.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output)

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from an empty output directory so a stale file from an earlier run
// can never ride along into this one. Clear only the directory's contents,
// never the directory itself: the grader mounts /output, and removing a
// mount point fails (EBUSY) and kills the run.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

// Refuse to hand in a site with no front door: if app/index.html is missing,
// the entry would be an empty folder, and failing here says so plainly.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing; nothing to hand in');
}

cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own (see the kit's RULES.txt, "The gate"): at
// most 4 screenshots of 256 KiB each, app/ at most 993 files and 16 MiB,
// and the dossier text capped at 160 KiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
