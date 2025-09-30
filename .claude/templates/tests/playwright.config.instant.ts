import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for INSTANT track E2E testing
 * Optimized for speed and automatic screenshot capture
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000, // 30 seconds max per test
  fullyParallel: false, // Run tests sequentially for INSTANT track
  forbidOnly: true,
  retries: 1, // One retry for flaky tests
  workers: 1, // Single worker for predictable execution
  reporter: [
    ['list'], // Simple list output
    ['json', { outputFile: 'e2e/reports/test-results.json' }], // JSON for parsing
    ['html', { outputFolder: 'e2e/reports/html', open: 'never' }], // HTML report
  ],

  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000',

    // Automatic screenshot on failure
    screenshot: {
      mode: 'on',
      fullPage: true,
    },

    // Trace on failure for debugging
    trace: 'on-first-retry',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Automatic waiting
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  // Single browser for INSTANT track (Chrome)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Dev server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Reuse if already running
    timeout: 120000, // 2 minutes to start
    stdout: 'ignore',
    stderr: 'pipe',
  },
});