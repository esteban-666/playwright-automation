import { PlaywrightTestConfig, devices } from '@playwright/test';
import { config as envConfig } from './config/environment';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  retries: envConfig.retries,
  timeout: envConfig.timeouts.navigation,
  workers: 3, // Optimized worker count for better performance
  expect: {
    timeout: envConfig.timeouts.element
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