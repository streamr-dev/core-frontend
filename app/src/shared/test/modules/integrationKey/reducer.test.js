import reducer, { initialState } from '$shared/modules/integrationKey/reducer'
import * as constants from '$shared/modules/integrationKey/constants'

describe('integrationKey - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    describe('INTEGRATION_KEYS', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingIntegrationKeys: true,
            }

            expect(reducer(undefined, {
                type: constants.INTEGRATION_KEYS_REQUEST,
                payload: {},
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const ethereumIdentities = ['test1', 'test2']
            const expectedState = {
                ...initialState,
                ethereumIdentities,
                fetchingIntegrationKeys: false,
            }

            expect(reducer(undefined, {
                type: constants.INTEGRATION_KEYS_SUCCESS,
                payload: {
                    ethereumIdentities,
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetchingIntegrationKeys: false,
                integrationKeysError: error,
            }

            expect(reducer(undefined, {
                type: constants.INTEGRATION_KEYS_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })
    })

    describe('CREATE_IDENTITY', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                creatingIdentity: true,
            }

            expect(reducer(undefined, {
                type: constants.CREATE_IDENTITY_REQUEST,
                payload: {},
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                ethereumIdentities: ['test1'],
                creatingIdentity: false,
            }

            expect(reducer(undefined, {
                type: constants.CREATE_IDENTITY_SUCCESS,
                payload: {
                    id: 'test1',
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                creatingIdentity: false,
                creatingIdentityError: error,
            }

            expect(reducer(undefined, {
                type: constants.CREATE_IDENTITY_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })
    })

    describe('DELETE_INTEGRATION_KEY', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                removingIntegrationKey: true,
            }

            expect(reducer(undefined, {
                type: constants.DELETE_INTEGRATION_KEY_REQUEST,
                payload: {},
            })).toStrictEqual(expectedState)
        })

        it('handles success for ethereum identity', () => {
            const nextState = {
                ...initialState,
                ethereumIdentities: ['test1', 'test2'],
                removingIntegrationKey: false,
            }
            const expectedState = {
                ...initialState,
                ethereumIdentities: ['test2'],
                removingIntegrationKey: false,
            }

            expect(reducer(nextState, {
                type: constants.DELETE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id: 'test1',
                },
            })).toStrictEqual(expectedState)
        })

        it('handles success for private key', () => {
            const nextState = {
                ...initialState,
                ethereumIdentities: ['test1', 'test2'],
                removingIntegrationKey: false,
            }
            const expectedState = {
                ...initialState,
                ethereumIdentities: ['test1', 'test2'],
                removingIntegrationKey: false,
            }

            expect(reducer(nextState, {
                type: constants.DELETE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id: 'test3',
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                removingIntegrationKey: false,
                removingIntegrationError: error,
            }

            expect(reducer(undefined, {
                type: constants.DELETE_INTEGRATION_KEY_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })
    })
})
