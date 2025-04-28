// jest.config.js
module.exports = {
    preset: 'ts-jest', // Use ts-jest preset to handle TypeScript
    testEnvironment: 'jest-environment-jsdom', // Use jsdom for React testing
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }], // Use ts-jest to transform JS/TS files
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Map @ imports if you're using them
      '\\.(css|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports for testing
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional: Setup for jest-dom
    transformIgnorePatterns: [
        'node_modules/(?!d3|internmap|delaunator|robust-predicates)',  // Add d3 to the list of modules Jest should transpile
      ],
};
