/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "tsconfig.test.json"
        }],
    },
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ['text-summary', 'lcov'],
    coverageThreshold: {
        global: {
            lines: 31,
        },
    },
    testTimeout: 30000,
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!*.test.{ts,tsx}', '!*.stories.*'],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/marketplace/components/deprecated',
        '<rootDir>/src/marketplace/modules/deprecated/',
        '/types/',
        '/tests/',
    ],
    moduleNameMapper: {
        '\\.svg$': '<rootDir>/test/test-utils/fileMock.ts',
        '\\.(pcss|scss|css|po|md)$': 'identity-obj-proxy',
        '\\.(png)$': '<rootDir>/scripts/emptyObject',
        '\\$config$': '<rootDir>/test/test-utils/testConfig.ts',
        '\\$app/(.*)$': '<rootDir>/$1',
        '\\$auth/(.*)$': '<rootDir>/src/auth/$1',
        '\\$mp/(.*)$': '<rootDir>/src/marketplace/$1',
        '\\$userpages/(.*)$': '<rootDir>/src/userpages/$1',
        '\\$routes$': '<rootDir>/src/routes',
        '\\$routes/(.*)?$': '<rootDir>/src/routes/$1',
        '\\$shared/(.*)$': '<rootDir>/src/shared/$1',
        '\\$testUtils/(.*)$': '<rootDir>/test/test-utils/$1',
        '\\$utils/(.*)$': '<rootDir>/src/utils/$1',
        '\\$ui/(.*)$': '<rootDir>/src/shared/components/Ui/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/test/test-utils/setupTests.ts'],
}
