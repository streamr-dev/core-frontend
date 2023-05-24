/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    transform: {
        "^.+\\.(t|j)sx?$": ["ts-jest", {
            tsconfig: "tsconfig.test.json"
        }],
    },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!query-string/)',
    ],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageProvider: "v8",
    coverageReporters: ['text-summary', 'lcov'],
    coverageThreshold: {
        global: {
            lines: 20,
        },
    },
    testTimeout: 30000,
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
    collectCoverageFrom: ['app/src/**/*.{ts,tsx}', '!*.test.{ts,tsx}', '!*.stories.*'],
    coveragePathIgnorePatterns: [
        '<rootDir>/app/src/marketplace/components/deprecated',
        '<rootDir>/app/src/marketplace/modules/deprecated/',
        '/types/',
        '/tests/',
    ],
    moduleNameMapper: {
        '\\.svg$': '<rootDir>/app/test/test-utils/fileMock.ts',
        '\\.(pcss|scss|css|po|md)$': 'identity-obj-proxy',
        '\\.(png)$': '<rootDir>/scripts/emptyObject',
        '\\$config$': '<rootDir>/app/test/test-utils/testConfig.ts',
        '\\$app/(.*)$': '<rootDir>/app/$1',
        '\\$mp/(.*)$': '<rootDir>/app/src/marketplace/$1',
        '\\$userpages/(.*)$': '<rootDir>/app/src/userpages/$1',
        '\\$routes$': '<rootDir>/app/src/routes',
        '\\$routes/(.*)?$': '<rootDir>/app/src/routes/$1',
        '\\$shared/(.*)$': '<rootDir>/app/src/shared/$1',
        '\\$testUtils/(.*)$': '<rootDir>/app/test/test-utils/$1',
        '\\$utils/(.*)$': '<rootDir>/app/src/utils/$1',
        '\\$ui/(.*)$': '<rootDir>/app/src/shared/components/Ui/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/app/test/test-utils/setupTests.ts'],
}
