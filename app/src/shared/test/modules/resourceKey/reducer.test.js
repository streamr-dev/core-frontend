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
})
