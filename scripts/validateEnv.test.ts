/* eslint-disable object-curly-newline */
import { ValidationError } from 'yup'
import validate from './validateEnv'

const VALID_ENV = {
    PLATFORM_PUBLIC_PATH: 'https://cdn.streamr.com',
    PORT: '12345',
    SENTRY_DSN: 'https://user@pass.ingest.sentry.io/1337',
    SENTRY_ENVIRONMENT: 'production',
    SENTRY_ORG: 'streamr',
    SENTRY_PROJECT: 'marketplace',
}

function ex(env = {}) {
    return expect(() => validate({ ...VALID_ENV, ...env }))
}

function presenceTest(key) {
    return async () => {
        await ex({
            [key]: null,
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: undefined,
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: '',
        }).rejects.toThrow(ValidationError)
    }
}

function urlTest(key, required = true) {
    return async () => {
        if (required) {
            await presenceTest(key)()
        }

        await ex({
            [key]: 'http://',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: 'anything',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: 1,
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: {},
        }).rejects.toThrow(ValidationError)
    }
}

function nonNegativeNumericTest(key, { allowZero = true } = {}) {
    return async () => {
        await presenceTest(key)()

        if (allowZero) {
            await ex({
                [key]: 0,
            }).resolves

            await ex({
                [key]: '0',
            }).resolves
        } else {
            await ex({
                [key]: 0,
            }).rejects.toThrow(ValidationError)

            await ex({
                [key]: '0',
            }).rejects.toThrow(ValidationError)
        }

        await ex({
            [key]: '-1',
        }).rejects.toThrow(ValidationError)

        await ex({
            [key]: -1,
        }).rejects.toThrow(ValidationError)
    }
}

it('validates valid env successfully', async () => {
    await ex().resolves
})

it('ensures valid PLATFORM_PUBLIC_PATH', presenceTest('PLATFORM_PUBLIC_PATH'))

it('ensures valid PORT', nonNegativeNumericTest('PORT'))

it('ensures valid SENTRY_DSN', urlTest('SENTRY_DSN', false))

it('ensures valid SENTRY_ENVIRONMENT', presenceTest('SENTRY_ENVIRONMENT'))

it('ensures valid SENTRY_ORG', presenceTest('SENTRY_ORG'))

it('ensures valid SENTRY_PROJECT', presenceTest('SENTRY_PROJECT'))
