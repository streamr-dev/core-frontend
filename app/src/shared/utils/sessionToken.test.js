import {
    setToken,
    getToken,
    setMethod,
    getMethod,
    SESSION_TOKEN_KEY,
    SESSION_LOGIN_TIME,
    SESSION_LOGIN_METHOD,
} from '$shared/utils/sessionToken'

describe('session token utility', () => {
    beforeEach(() => {
        global.localStorage.clear()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getToken', () => {
        it('gives null by default', () => {
            expect(getToken()).toBe(null)
        })

        it('gives the stored value before its expiration', () => {
            global.localStorage.setItem(SESSION_TOKEN_KEY, 'token')
            global.localStorage.setItem(SESSION_LOGIN_TIME, '2020-03-26T14:00:00.000Z')

            jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2020-03-26T15:00:00.000Z').getTime())

            expect(getToken()).toBe('token')

            // 60s before expiration
            jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2020-03-26T19:59:00.000Z').getTime())
            expect(getToken()).toBe('token')

            // 60s after expiration
            jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2020-03-26T20:01:00.000Z').getTime())
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

    describe('getToken', () => {
        it('gives null by default', () => {
            expect(getToken()).toBe(null)
        })

        it('gives the stored value', () => {
            global.localStorage.setItem(SESSION_LOGIN_METHOD, 'metamask')
            expect(getMethod()).toBe('metamask')
        })

        it('gives null if stored method is an empty string', () => {
            global.localStorage.setItem(SESSION_LOGIN_METHOD, '')

            expect(getMethod()).toBe(null)
        })
    })

    describe('setMethod', () => {
        it('puts non-empty value into local storage', () => {
            setMethod('')
            expect(global.localStorage.getItem(SESSION_LOGIN_METHOD)).toBe(null)
            setMethod(null)
            expect(global.localStorage.getItem(SESSION_LOGIN_METHOD)).toBe(null)
            setMethod(undefined)
            expect(global.localStorage.getItem(SESSION_LOGIN_METHOD)).toBe(null)
            setMethod('metamask')
            expect(global.localStorage.getItem(SESSION_LOGIN_METHOD)).toBe('metamask')
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
            const currentDate = new Date('2020-03-26T14:00:00.000Z')
            const realDate = Date

            global.Date = class extends Date {
                constructor() {
                    return currentDate
                }
            }
            setToken2('token')
            global.Date = realDate

            jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2020-03-26T15:00:00.000Z').getTime())
            expect(getToken2()).toBe('token')

            // 60s before expiration
            jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2020-03-26T19:59:00.000Z').getTime())
            expect(getToken2()).toBe('token')

            // 60s after expiration
            jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2020-03-26T20:01:00.000Z').getTime())
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
