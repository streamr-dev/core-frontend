import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/user/reducer'
import * as constants from '../../../../src/modules/user/constants'

describe('user - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles logout', () => {
        const expectedState = {
            ...initialState,
            apiKey: null,
            integrationKeys: null,
            loginError: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.LOGOUT,
            payload: {},
        }), expectedState)
    })

    it('handles external login start', () => {
        const expectedState = {
            ...initialState,
            fetchingExternalLogin: true,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.EXTERNAL_LOGIN_START,
            payload: {},
        }), expectedState)
    })

    it('handles external login end', () => {
        const expectedState = {
            ...initialState,
            fetchingExternalLogin: false,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.EXTERNAL_LOGIN_END,
            payload: {},
        }), expectedState)
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

    describe('LINKED_WEB3_ACCOUNTS', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingWeb3Accounts: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.LINKED_WEB3_ACCOUNTS_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const web3Accounts = [
                {
                    address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                    name: 'test1',
                },
                {
                    address: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
                    name: 'test2',
                },
            ]
            const expectedState = {
                ...initialState,
                web3Accounts,
                fetchingWeb3Accounts: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.LINKED_WEB3_ACCOUNTS_SUCCESS,
                payload: {
                    accounts: web3Accounts,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                web3Accounts: null,
                fetchingWeb3Accounts: false,
                web3AccountsError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.LINKED_WEB3_ACCOUNTS_FAILURE,
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

    describe('USER_PRODUCT_PERMISSIONS', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                productPermissions: {
                    read: false,
                    write: false,
                    share: false,
                    fetchingPermissions: true,
                    permissionsError: null,
                },
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_USER_PRODUCT_PERMISSIONS_REQUEST,
                payload: {
                    id: 1,
                },
            }), expectedState)
        })

        it('handles success', () => {
            const permissions = {
                read: true,
                write: true,
                share: false,
            }

            const expectedState = {
                ...initialState,
                productPermissions: {
                    ...permissions,
                    fetchingPermissions: false,
                    permissionsError: null,
                },
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
                payload: {
                    ...permissions,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                productPermissions: {
                    read: false,
                    write: false,
                    share: false,
                    fetchingPermissions: false,
                    permissionsError: error,
                },
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_USER_PRODUCT_PERMISSIONS_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })
})
