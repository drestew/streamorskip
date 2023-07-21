import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: [
    'node_modules',
    'utils',
    '<rootDir>',
  ],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
  },
};

export default createJestConfig(customJestConfig);
