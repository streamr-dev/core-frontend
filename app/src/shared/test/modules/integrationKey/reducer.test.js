import assert from 'assert-diff'

import reducer, { initialState } from '$shared/modules/integrationKey/reducer'
import * as constants from '$shared/modules/integrationKey/constants'

describe('integrationKey - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('INTEGRATION_KEYS', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingIntegrationKeys: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.INTEGRATION_KEYS_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const ethereumIdentities = ['test1', 'test2']
            const privateKeys = ['test3']
            const expectedState = {
                ...initialState,
                ethereumIdentities,
                privateKeys,
                fetchingIntegrationKeys: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.INTEGRATION_KEYS_SUCCESS,
                payload: {
                    ethereumIdentities,
                    privateKeys,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetchingIntegrationKeys: false,
                integrationKeysError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.INTEGRATION_KEYS_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('CREATE_INTEGRATION_KEY', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                creatingIntegrationKey: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_INTEGRATION_KEY_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                privateKeys: ['test1'],
                creatingIntegrationKey: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id: 'test1',
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                creatingIntegrationKey: false,
                creatingIntegrationKeyError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_INTEGRATION_KEY_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('CREATE_IDENTITY', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                creatingIdentity: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_IDENTITY_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                ethereumIdentities: ['test1'],
                creatingIdentity: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_IDENTITY_SUCCESS,
                payload: {
                    id: 'test1',
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                creatingIdentity: false,
                creatingIdentityError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_IDENTITY_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('DELETE_INTEGRATION_KEY', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                removingIntegrationKey: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.DELETE_INTEGRATION_KEY_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success for ethereum identity', () => {
            const nextState = {
                ...initialState,
                ethereumIdentities: ['test1', 'test2'],
                privateKeys: ['test3'],
                removingIntegrationKey: false,
            }
            const expectedState = {
                ...initialState,
                ethereumIdentities: ['test2'],
                privateKeys: ['test3'],
                removingIntegrationKey: false,
            }

            assert.deepStrictEqual(reducer(nextState, {
                type: constants.DELETE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id: 'test1',
                },
            }), expectedState)
        })

        it('handles success for private key', () => {
            const nextState = {
                ...initialState,
                ethereumIdentities: ['test1', 'test2'],
                privateKeys: ['test3'],
                removingIntegrationKey: false,
            }
            const expectedState = {
                ...initialState,
                ethereumIdentities: ['test1', 'test2'],
                privateKeys: [],
                removingIntegrationKey: false,
            }

            assert.deepStrictEqual(reducer(nextState, {
                type: constants.DELETE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id: 'test3',
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                removingIntegrationKey: false,
                removingIntegrationError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.DELETE_INTEGRATION_KEY_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })
})
