const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '@components/(.*)': '<rootDir>/src/components/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)test.[jt]s?(x)'],
};

module.exports = createJestConfig(customJestConfig);