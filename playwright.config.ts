import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  retries: 1,
  timeout: 60 * 1000,
  workers: 3, // Optimized worker count for better performance
  expect: {
    timeout: 10000
  },
  reporter: 'html',
  /* Define projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Temporarily disabled WebKit due to crashes on macOS
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on',
  },
};

export default config; 