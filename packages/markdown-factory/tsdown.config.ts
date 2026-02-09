import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'lib/flavors/slack-mrkdwn': 'src/lib/flavors/slack-mrkdwn.ts',
  },
  format: ['cjs', 'esm'],
  dts: { build: true },
  outDir: '../../dist/packages/markdown-factory',
  external: ['yaml'],
  copy: {
    from: ['package.json', '*.md'],
  },
});
