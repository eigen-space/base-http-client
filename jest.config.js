module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        'libs/**/*.ts'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.d\\.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/libs/**/*.spec.ts'
    ],
    setupFiles: [
        '<rootDir>/config/jest/setup/console.setup.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/config/jest/env-setup/check-assertions-number.ts'
    ],
    transform: {
        '^(?!.*\\.(js|ts|tsx|css|json)$)': '<rootDir>/config/jest/transform/file.transform.ts',
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: [
        'web.ts',
        'ts',
        'web.js',
        'js',
        'json',
        'node'
    ],
    globals: {
        'ts-jest': { tsConfig: './tsconfig.spec.json' }
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            lines: 100,
            functions: 100
        }
    }
};
