import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'logger',
    setupFiles: ['./test/network-guard.ts'],
  },
});
