import assert from 'assert-diff'

import reducer, { initialState } from '$shared/modules/user/reducer'
import * as constants from '$shared/modules/user/constants'

describe('user - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('LOGOUT_*', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingLogout: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.LOGOUT_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                fetchingLogout: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.LOGOUT_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('logout error')
            const expectedState = {
                ...initialState,
                logoutError: error,
                fetchingLogout: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.LOGOUT_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('API_KEYS', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingApiKey: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.API_KEYS_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const apiKey = {
                id: 'testid',
                name: 'Default',
                user: 'tester1@streamr.com',
            }
            const expectedState = {
                ...initialState,
                apiKey,
                fetchingApiKey: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.API_KEYS_SUCCESS,
                payload: {
                    apiKey,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetchingApiKey: false,
                apiKeyError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.API_KEYS_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('USER_DATA', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingUserData: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.USER_DATA_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const user = {
                name: 'Tester1',
                username: 'tester1@streamr.com',
                timezone: 'Zulu',
            }

            const expectedState = {
                ...initialState,
                user,
                fetchingUserData: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.USER_DATA_SUCCESS,
                payload: {
                    user,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                user: null,
                fetchingUserData: false,
                userDataError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.USER_DATA_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('UPDATE_CURRENT_USER', () => {
        it('should update the user on UPDATE_CURRENT_USER', () => {
            assert.deepStrictEqual(reducer({
                some: 'state',
                user: {
                    name: 'test',
                    email: 'test2',
                },
            }, {
                type: constants.UPDATE_CURRENT_USER,
                payload: {
                    user: {
                        email: 'test3',
                        timezone: 'test4',
                    },
                },
            }), {
                some: 'state',
                saved: false,
                user: {
                    name: 'test',
                    email: 'test3',
                    timezone: 'test4',
                },
            })
        })
        it('should add the user if currentUser === null', () => {
            assert.deepStrictEqual(reducer({
                some: 'state',
                user: null,
            }, {
                type: constants.UPDATE_CURRENT_USER,
                payload: {
                    user: {
                        name: 'test',
                        email: 'test3',
                        timezone: 'test4',
                    },
                },
            }), {
                some: 'state',
                saved: false,
                user: {
                    name: 'test',
                    email: 'test3',
                    timezone: 'test4',
                },
            })
        })
    })

    describe('SAVE_CURRENT_USER', () => {
        it('should set fetching = true on SAVE_CURRENT_USER_REQUEST', () => {
            assert.deepStrictEqual(reducer({
                some: 'state',
            }, {
                type: constants.SAVE_CURRENT_USER_REQUEST,
            }), {
                some: 'state',
                fetchingUserData: true,
            })
        })

        it('should set the user as currentUser on SAVE_CURRENT_USER_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                some: 'state',
            }, {
                type: constants.SAVE_CURRENT_USER_SUCCESS,
                payload: {
                    user: {
                        just: 'someField',
                    },
                },
            }), {
                some: 'state',
                user: {
                    just: 'someField',
                },
                fetchingUserData: false,
                userDataError: null,
                saved: true,
            })
        })

        it('should handle the error on SAVE_CURRENT_USER_FAILURE', () => {
            assert.deepStrictEqual(reducer({
                some: 'field',
            }, {
                type: constants.SAVE_CURRENT_USER_FAILURE,
                payload: {
                    error: new Error('test-error'),
                },
            }), {
                some: 'field',
                fetchingUserData: false,
                userDataError: new Error('test-error'),
            })
        })
    })
})
