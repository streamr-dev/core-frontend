import { setToken, getToken, SESSION_TOKEN_KEY, SESSION_LOGIN_TIME, EXPIRES_AT_VALID_HOURS } from '$shared/utils/sessionToken'
import sinon from 'sinon'

describe('session token utility', () => {
    let clock
    let sandbox

    beforeEach(() => {
        global.localStorage.clear()
        clock = sinon.useFakeTimers(new Date())
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        clock.restore()
        sandbox.restore()
    })

    describe('getToken', () => {
        it('gives null by default', () => {
            expect(getToken()).toBe(null)
        })

        it('gives the stored value before its expiration', () => {
            global.localStorage.setItem(SESSION_TOKEN_KEY, 'token')
            global.localStorage.setItem(SESSION_LOGIN_TIME, new Date())
            expect(getToken()).toBe('token')
            clock.tick(((EXPIRES_AT_VALID_HOURS * 3600) - 60) * 1000) // 60s before expiration
            expect(getToken()).toBe('token')
            clock.tick(120 * 1000) // 60s after expiration
            expect(getToken()).toBe(null)
        })

        it('gives null if stored token is an empty string', () => {
            global.localStorage.setItem(SESSION_TOKEN_KEY, '')
            global.localStorage.setItem(SESSION_LOGIN_TIME, new Date())

            expect(getToken()).toBe(null)
        })
    })

    describe('setToken', () => {
        it('puts non-empty value into local storage', () => {
            setToken('')
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
            setToken(null)
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
            setToken(undefined)
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
            setToken('token')
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe('token')
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(new Date().toString())
        })
    })

    describe('fallback storage', () => {
        jest.resetModules()

        jest.mock('$shared/utils/storage', () => ({
            __esModule: true,
            isLocalStorageAvailable: () => false,
        }))

        // eslint-disable-next-line global-require
        const { setToken: setToken2, getToken: getToken2 } = require('$shared/utils/sessionToken')

        afterEach(() => {
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
        })

        it('stores null by default', () => {
            expect(getToken2()).toBe(null)
        })

        it('stores and expires a token', () => {
            setToken2('token')
            expect(getToken2()).toBe('token')
            clock.tick(((EXPIRES_AT_VALID_HOURS * 3600) - 60) * 1000) // 60s before expiration
            expect(getToken2()).toBe('token')
            clock.tick(120 * 1000) // 60s after expiration
            expect(getToken2()).toBe(null)
        })

        it('stores null when token is a falsy value', () => {
            setToken2('')
            expect(getToken2()).toBe(null)
            setToken2(null)
            expect(getToken2()).toBe(null)
            setToken2(undefined)
            expect(getToken2()).toBe(null)
        })
    })
})
