import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset URLs keep the build portable when mounted under a
  // Heartbeat Observatory route instead of the domain root.
  base: './',
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
