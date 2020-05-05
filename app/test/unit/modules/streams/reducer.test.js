import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/streams/reducer'
import * as constants from '$mp/modules/streams/constants'

describe('streams - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ids: [],
            fetching: true,
            error: null,
            hasMoreResults: false,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_STREAMS_REQUEST,
            payload: {},
        }), expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ids: [1, 2],
            fetching: false,
            error: null,
            hasMoreResults: true,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_STREAMS_SUCCESS,
            payload: {
                streams: [1, 2],
                hasMoreResults: true,
            },
        }), expectedState)
    })

    it('combines stream ids to list', () => {
        const state = {
            ids: [1, 2],
            fetching: false,
            error: null,
            hasMoreResults: true,
        }
        const expectedState = {
            ids: [1, 2, 3, 4],
            fetching: false,
            error: null,
            hasMoreResults: false,
        }

        assert.deepStrictEqual(reducer(state, {
            type: constants.GET_STREAMS_SUCCESS,
            payload: {
                streams: [3, 4],
                hasMoreResults: false,
            },
        }), expectedState)
    })

    it('combines stream ids to list and removes duplicates', () => {
        const state = {
            ids: [1, 2, 3],
            fetching: false,
            error: null,
            hasMoreResults: true,
        }
        const expectedState = {
            ids: [1, 2, 3, 4, 5],
            fetching: false,
            error: null,
            hasMoreResults: false,
        }

        assert.deepStrictEqual(reducer(state, {
            type: constants.GET_STREAMS_SUCCESS,
            payload: {
                streams: [3, 4, 5],
                hasMoreResults: false,
            },
        }), expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ids: [],
            fetching: false,
            error,
            hasMoreResults: false,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_STREAMS_FAILURE,
            payload: {
                error,
            },
        }), expectedState)
    })

    it('clears the stream list', () => {
        const state = {
            ids: ['1', '2'],
            fetching: false,
            error: null,
            hasMoreResults: false,
        }
        const expectedState = {
            ids: [],
            fetching: false,
            error: null,
            hasMoreResults: false,
        }

        assert.deepStrictEqual(reducer(state, {
            type: constants.CLEAR_STREAM_LIST,
        }), expectedState)
    })
})
