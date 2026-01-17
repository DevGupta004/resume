// Process polyfill for browser
// Must run before React Native modules load
const processPolyfill = {
  env: {
    NODE_ENV: 'development',
  },
  platform: 'web',
  version: '',
  browser: true,
  nextTick: (fn) => setTimeout(fn, 0),
  cwd: () => '/',
};

// Set on all possible global objects
if (typeof global !== 'undefined') {
  global.process = processPolyfill;
}
if (typeof window !== 'undefined') {
  window.process = processPolyfill;
}
if (typeof globalThis !== 'undefined') {
  globalThis.process = processPolyfill;
}

// Define __DEV__ global (required by React Native libraries)
if (typeof global !== 'undefined') {
  global.__DEV__ = true;
}
if (typeof window !== 'undefined') {
  window.__DEV__ = true;
}
if (typeof globalThis !== 'undefined') {
  globalThis.__DEV__ = true;
}

// Export for ES modules
export default processPolyfill;
