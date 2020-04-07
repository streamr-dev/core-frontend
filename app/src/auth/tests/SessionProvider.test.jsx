import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import Context from '$auth/contexts/Session'

import SessionProvider, { SESSION_TOKEN_KEY, SESSION_LOGIN_TIME } from '$auth/components/SessionProvider'

describe('SessionProvider', () => {
    let realDate

    beforeEach(() => {
        realDate = Date.now
        global.localStorage.clear()
    })

    afterEach(() => {
        global.Date.now = realDate
    })

    afterAll(() => {
        global.localStorage.clear()
    })

    it('returns no token by default', () => {
        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBeFalsy()
        expect(currentContext.token).toBeFalsy()
    })

    it('returns empty token if no expires date set', () => {
        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBeFalsy()
    })

    it('returns stored token if not expired', () => {
        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        const date = new Date()
        date.setHours(date.getHours() - 2)
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_LOGIN_TIME, date)

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBe('myToken')
    })

    it('does not return token if expired', () => {
        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        const date = new Date()
        date.setHours(date.getHours() - 8)
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_LOGIN_TIME, date)

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBeFalsy()
    })

    it('returns token if now = 22pm previous day and date = 2am', () => {
        global.Date.now = jest.fn(() => new Date('2020-01-02T02:00:00.000Z').getTime())

        const date = new Date('2020-01-01T22:00:00.000Z')
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_LOGIN_TIME, date)

        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBe('myToken')
    })

    it('does not return token if now = 10am and date = 10pm', () => {
        global.Date.now = jest.fn(() => new Date('2020-01-01T22:00:00.000Z').getTime())

        const date = new Date('2020-01-01T10:00:00.000Z')
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_LOGIN_TIME, date)

        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBeFalsy()
    })

    it('sets session token', () => {
        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBeFalsy()

        act(() => {
            currentContext.setSessionToken('myToken')
        })

        expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe('myToken')
        expect(currentContext.token).toBe('myToken')
    })

    it('stores new token when changed', async () => {
        let currentContext

        const Test = () => {
            currentContext = useContext(Context)

            return null
        }

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBeFalsy()

        act(() => {
            currentContext.setSessionToken('myToken')
        })

        expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe('myToken')
        expect(currentContext.token).toBe('myToken')

        const oldDate = new Date(global.localStorage.getItem(SESSION_LOGIN_TIME))

        await act(async () => {
            await (() => new Promise((resolve) => {
                setTimeout(() => {
                    currentContext.setSessionToken('anotherToken')
                    resolve()
                }, 5000)
            }))()
        })

        expect(global.localStorage.getItem(SESSION_TOKEN_KEY)).toBe('anotherToken')
        expect(currentContext.token).toBe('anotherToken')
        const newDate = new Date(global.localStorage.getItem(SESSION_LOGIN_TIME))
        expect(newDate.getTime()).toBeGreaterThan(oldDate.getTime())
    })
})
