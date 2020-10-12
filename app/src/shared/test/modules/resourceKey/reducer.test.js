import assert from 'assert-diff'

import reducer, { initialState } from '$shared/modules/resourceKey/reducer'
import * as constants from '$shared/modules/resourceKey/constants'

describe('resourceKey - reducer', () => {
    it('should return the initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('GET_RESOURCE_KEYS', () => {
        it('should set fetching = true on GET_RESOURCE_KEYS_REQUEST', () => {
            const expectedState = {
                ...initialState,
                fetching: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_RESOURCE_KEYS_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('should add the key to the resource on GET_STREAM_RESOURCE_KEYS_SUCCESS', () => {
            const streamId = '1234'
            const keys = ['test', 'test2']
            const expectedState = {
                ...initialState,
                streams: {
                    [streamId]: keys,
                },
                fetching: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_STREAM_RESOURCE_KEYS_SUCCESS,
                payload: {
                    id: streamId,
                    keys,
                },
            }), expectedState)
        })

        it('should handle the error on GET_RESOURCE_KEYS_FAILURE', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetching: false,
                error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_RESOURCE_KEYS_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('ADD_RESOURCE_KEY', () => {
        it('should set fetching = true on ADD_RESOURCE_KEY_REQUEST', () => {
            const expectedState = {
                ...initialState,
                fetching: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.ADD_RESOURCE_KEY_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('should add the key to the resource on ADD_STREAM_RESOURCE_KEY_SUCCESS if the resource doesn\'t already have keys', () => {
            const streamId = '1234'
            const key = 'test'
            const expectedState = {
                ...initialState,
                streams: {
                    [streamId]: [key],
                },
                fetching: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.ADD_STREAM_RESOURCE_KEY_SUCCESS,
                payload: {
                    id: streamId,
                    key,
                },
            }), expectedState)
        })

        it('should add the key to the resource on ADD_STREAM_RESOURCE_KEY_SUCCESS if the resource already has keys', () => {
            const streamId = '1234'
            const key = 'test'
            const nextState = {
                ...initialState,
                streams: {
                    [streamId]: ['test1', 'test2'],
                    otherStream: ['1', '2', '3'],
                },
            }
            const expectedState = {
                ...initialState,
                streams: {
                    [streamId]: ['test1', 'test2', key],
                    otherStream: ['1', '2', '3'],
                },
                fetching: false,
            }

            assert.deepStrictEqual(reducer(nextState, {
                type: constants.ADD_STREAM_RESOURCE_KEY_SUCCESS,
                payload: {
                    id: streamId,
                    key,
                },
            }), expectedState)
        })

        it('should handle the error on ADD_RESOURCE_KEY_FAILURE', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetching: false,
                error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.ADD_RESOURCE_KEY_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('REMOVE_RESOURCE_KEY', () => {
        it('should set fetching = true on REMOVE_RESOURCE_KEY_REQUEST', () => {
            const expectedState = {
                ...initialState,
                fetching: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.REMOVE_RESOURCE_KEY_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('should remove the key on REMOVE_STREAM_RESOURCE_KEY_SUCCESS', () => {
            const streamId = '1234'
            const key = 'test2'
            const nextState = {
                ...initialState,
                streams: {
                    [streamId]: ['test1', 'test2'],
                },
            }
            const expectedState = {
                ...initialState,
                streams: {
                    [streamId]: ['test1'],
                },
                fetching: false,
            }

            assert.deepStrictEqual(reducer(nextState, {
                type: constants.REMOVE_STREAM_RESOURCE_KEY_SUCCESS,
                payload: {
                    id: streamId,
                    key,
                },
            }), expectedState)
        })

        it('should do nothing if no key is found on REMOVE_STREAM_RESOURCE_KEY_SUCCESS', () => {
            const streamId = '1234'
            const key = 'somekey'
            const nextState = {
                ...initialState,
                streams: {
                    [streamId]: ['test1', 'test2'],
                },
            }
            const expectedState = {
                ...initialState,
                streams: {
                    [streamId]: ['test1', 'test2'],
                },
                fetching: false,
            }

            assert.deepStrictEqual(reducer(nextState, {
                type: constants.REMOVE_STREAM_RESOURCE_KEY_SUCCESS,
                payload: {
                    id: streamId,
                    key,
                },
            }), expectedState)
        })

        it('should handle the error on REMOVE_RESOURCE_KEY_FAILURE', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetching: false,
                error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.REMOVE_RESOURCE_KEY_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })
})
