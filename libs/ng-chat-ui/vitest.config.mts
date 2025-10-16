/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// THIS IS NOW YOUR DEDICATED TEST CONFIG
export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ng-chat-ui',
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'ng-chat-ui',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/ng-chat-ui',
      provider: 'v8' as const,
    },
  },
});
