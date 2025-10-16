import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// THIS IS DEDICATED to building
export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ng-contacts',

  plugins: [
    angular(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']) // Copy README.md to dist
  ],

  // Define it as a library build
  build: {
    lib: {
      // Point to your library's entry file (e.g., src/index.ts)
      entry: 'src/index.ts',
      name: 'ng-contacts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize dependencies that Angular will provide
      external: ['rxjs', 'zone.js', /^@angular\//],
    },
  },
});
