import { store, retrieve, SESSION_TOKEN_KEY, SESSION_LOGIN_TIME, EXPIRES_AT_VALID_HOURS } from '$shared/utils/sessionToken'
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

    describe('retrieve', () => {
        it('gives null by default', () => {
            expect(retrieve()).toBe(null)
        })

        it('gives the stored value before its expiration', () => {
            global.localStorage.setItem(SESSION_TOKEN_KEY, 'token')
            global.localStorage.setItem(SESSION_LOGIN_TIME, new Date())
            expect(retrieve()).toBe('token')
            clock.tick(((EXPIRES_AT_VALID_HOURS * 3600) - 60) * 1000) // 60s before expiration
            expect(retrieve()).toBe('token')
            clock.tick(120 * 1000) // 60s after expiration
            expect(retrieve()).toBe(null)
        })

        it('gives null if stored token is an empty string', () => {
            global.localStorage.setItem(SESSION_TOKEN_KEY, '')
            global.localStorage.setItem(SESSION_LOGIN_TIME, new Date())

            expect(retrieve()).toBe(null)
        })
    })

    describe('store', () => {
        it('puts non-empty value into local storage', () => {
            store('')
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
            store(null)
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
            store(undefined)
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
            store('token')
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
        const { store: store2, retrieve: retrieve2 } = require('$shared/utils/sessionToken')

        afterEach(() => {
            expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_TIME)).toBe(null)
        })

        it('retrieves null by default', () => {
            expect(retrieve2()).toBe(null)
        })

        it('retrieves the stored value before its expiration', () => {
            store2('token')
            expect(retrieve2()).toBe('token')
            clock.tick(((EXPIRES_AT_VALID_HOURS * 3600) - 60) * 1000) // 60s before expiration
            expect(retrieve2()).toBe('token')
            clock.tick(120 * 1000) // 60s after expiration
            expect(retrieve2()).toBe(null)
        })

        it('retrieves null if stored token is an empty string', () => {
            store2('')
            expect(retrieve2()).toBe(null)
            store2(null)
            expect(retrieve2()).toBe(null)
            store2(undefined)
            expect(retrieve2()).toBe(null)
        })
    })
})
