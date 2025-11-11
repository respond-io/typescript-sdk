module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testTimeout: 30000,
    roots: ['<rootDir>/tests', '<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    
    // Handle .js extensions in imports
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    
    // Transform TypeScript files
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: {
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                },
            },
        ],
    },
    
    // Don't transform node_modules except for node-fetch and related packages
    transformIgnorePatterns: [
      'node_modules/(?!(node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill)/)',
    ],
    
    // Coverage configuration
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/**/index.ts',
    ],
    
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/',
    ],
  };