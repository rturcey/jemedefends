const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
        setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
        moduleNameMapping: {
            '^@/(.*): '<rootDir>/src/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/types.ts',
        '!src/**/constants.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 75,
            lines: 75,
            statements: 75
        }
    }
};

module.exports = createJestConfig(customJestConfig);