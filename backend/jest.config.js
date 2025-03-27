module.exports = {
  globalSetup: "./tests/setup.js",
  globalTeardown: "./tests/teardown.js",
  testEnvironment: "node",
  testTimeout: 10000,
  maxWorkers: 1, // Ensure tests run sequentially
  detectOpenHandles: true,
  forceExit: true,
};
