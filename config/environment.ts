// Environment configuration for different test environments
export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  credentials: {
    valid: {
      email: string;
      password: string;
    };
    invalid: {
      email: string;
      password: string;
    };
  };
  timeouts: {
    element: number;
    navigation: number;
    api: number;
  };
  retries: number;
}

// Environment configurations
const environments: Record<string, EnvironmentConfig> = {
  development: {
    baseUrl: 'https://rahulshettyacademy.com',
    apiUrl: 'https://rahulshettyacademy.com/api',
    credentials: {
      valid: {
        email: process.env.TEST_EMAIL || 'rahulshetty@gmail.com',
        password: process.env.TEST_PASSWORD || 'Iamking@000'
      },
      invalid: {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }
    },
    timeouts: {
      element: 10000,
      navigation: 30000,
      api: 15000
    },
    retries: 1
  },
  
  staging: {
    baseUrl: 'https://staging.rahulshettyacademy.com',
    apiUrl: 'https://staging.rahulshettyacademy.com/api',
    credentials: {
      valid: {
        email: process.env.STAGING_EMAIL || 'rahulshetty@gmail.com',
        password: process.env.STAGING_PASSWORD || 'Iamking@000'
      },
      invalid: {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }
    },
    timeouts: {
      element: 15000,
      navigation: 45000,
      api: 20000
    },
    retries: 2
  },
  
  production: {
    baseUrl: 'https://rahulshettyacademy.com',
    apiUrl: 'https://rahulshettyacademy.com/api',
    credentials: {
      valid: {
        email: process.env.PROD_EMAIL || 'rahulshetty@gmail.com',
        password: process.env.PROD_PASSWORD || 'Iamking@000'
      },
      invalid: {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }
    },
    timeouts: {
      element: 20000,
      navigation: 60000,
      api: 30000
    },
    retries: 3
  }
};

// Get current environment
export function getEnvironment(): string {
  return process.env.TEST_ENV || process.env.NODE_ENV || 'development';
}

// Get current environment configuration
export function getConfig(): EnvironmentConfig {
  const env = getEnvironment();
  return environments[env] || environments.development;
}

// Export default configuration
export const config = getConfig(); 