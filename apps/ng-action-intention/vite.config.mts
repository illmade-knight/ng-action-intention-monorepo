/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/ng-action-intention', // Corrected path
  plugins: [
    // FIX 1: Configure the Angular plugin to handle SCSS
    angular({
      inlineStylesExtension: 'scss',
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  test: {
    name: 'ng-action-intention',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'], // Simplified include path
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/ng-action-intention',
      provider: 'v8' as const,
    },
    // FIX 2: Prevent Vite from transforming the protos dependency
    transformMode: {
      ssr: [/@illmade-knight\/action-intention-protos/],
    },
  },
}));
