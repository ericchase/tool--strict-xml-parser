const outname = 'utility-xml';
const srcpath_map = {};
const target: Bun.Target = 'browser';
const tscpath = '../bundle@tsc-standalone/out/tsc.js';

// --- //

import { default as NODE_FS } from 'node:fs/promises';

// Update Packages

Bun.spawnSync(['bun', 'update', '--latest'], { stderr: 'inherit', stdout: 'inherit' });
Bun.spawnSync(['bun', 'install'], { stderr: 'inherit', stdout: 'inherit' });

// Delete Out Directory

await NODE_FS.rm('./out/', { recursive: true, force: true });

// Compile Source File

const results = await Bun.build({
  entrypoints: ['./src/main.ts'],
  minify: {
    identifiers: false,
    syntax: false,
    whitespace: true,
  },
  target,
});

for (const artifact of results.outputs) {
  switch (artifact.kind) {
    case 'entry-point': {
      await Bun.write(`./out/${outname}.js`, artifact);
      break;
    }
  }
}

// Emit Declaration Files

Bun.spawnSync(['bun', tscpath, '-p', './tsconfig.declarations.json'], { stderr: 'inherit', stdout: 'inherit' });
await NODE_FS.rename(`./out/main.d.ts`, `./out/${outname}.d.ts`);

// Copy Static Files

for (const [srcpath, outpath] of Object.entries(srcpath_map)) {
  await Bun.write('./out/' + outpath, Bun.file('./src/' + srcpath));
}

// Format Files

Bun.spawnSync(['bun', 'run', 'format'], { stderr: 'inherit', stdout: 'inherit' });

// Test

Bun.spawnSync(['bun', 'test', './src/main.test.ts'], { stderr: 'inherit', stdout: 'inherit' });
