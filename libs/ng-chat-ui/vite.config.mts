import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// THIS IS NOW YOUR DEDICATED BUILD CONFIG
export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ng-chat-ui',
  plugins: [
    angular(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']) // This is a build-related plugin
  ],

  // Define it as a library build
  build: {
    lib: {
      // Point to your library's entry point (assuming src/index.ts)
      entry: 'src/index.ts',
      name: 'ng-chat-ui',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['rxjs', 'zone.js', /^@angular\//],
    },
  },
});
