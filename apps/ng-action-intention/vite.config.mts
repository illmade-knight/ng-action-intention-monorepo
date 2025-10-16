import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/ng-action-intention',
  plugins: [angular(), nxViteTsPaths()],

  // The 'test' block and 'reference' directive are GONE

  build: {
    outDir: '../../dist/apps/ng-action-intention',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
