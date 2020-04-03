import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import Context from '$auth/contexts/Session'

import SessionProvider, { SESSION_TOKEN_KEY, SESSION_EXPIRES_AT } from '$auth/components/SessionProvider'

describe('SessionProvider', () => {
    beforeEach(() => {
        global.localStorage.clear()
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
        date.setHours(date.getHours() + 2)
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_EXPIRES_AT, date)

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
        date.setHours(date.getHours() + 8)
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_EXPIRES_AT, date)

        mount((
            <SessionProvider>
                <Test />
            </SessionProvider>
        ))

        expect(currentContext.token).toBeFalsy()
    })

    it('returns token if now = 5am and date = 10am', () => {
        const realDate = Date.now
        global.Date.now = jest.fn(() => new Date('2020-01-01T05:00:00.000Z').getTime())

        const date = new Date('2020-01-01T10:00:00.000Z')
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_EXPIRES_AT, date)

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
        global.Date.now = realDate
    })

    it('returns token if now = 10am and date = 5am', () => {
        const realDate = Date.now
        global.Date.now = jest.fn(() => new Date('2020-01-01T10:00:00.000Z').getTime())

        const date = new Date('2020-01-01T05:00:00.000Z')
        global.localStorage.setItem(SESSION_TOKEN_KEY, 'myToken')
        global.localStorage.setItem(SESSION_EXPIRES_AT, date)

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

        global.Date.now = realDate
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
})
