import reducer from '$userpages/modules/userPageStreams/reducer'
import * as actions from '$userpages/modules/userPageStreams/actions'

const initialState = {
    ids: [],
    openStream: {
        id: null,
    },
    savingStreamFields: false,
    fetching: false,
    updating: false,
    deleting: false,
    error: null,
    streamFieldAutodetectError: null,
    pageSize: 20,
    hasMoreSearchResults: null,
}

describe('Stream reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    describe('REQUEST actions', () => {
        it('should set fetching = true on all REQUEST actions', () => {
            [
                actions.GET_STREAM_REQUEST,
                actions.CREATE_STREAM_REQUEST,
                actions.UPDATE_STREAM_REQUEST,
                actions.DELETE_STREAM_REQUEST,
            ].forEach((action) => {
                expect(reducer({
                    fetching: false,
                }, {
                    type: action,
                }).fetching).toBe(true)
            })
        })
    })

    describe(actions.UPDATE_STREAM_REQUEST, () => {
        it('raises the `updating` flag', () => {
            expect(reducer({
                updating: false,
            }, {
                type: actions.UPDATE_STREAM_REQUEST,
            }).updating).toBe(true)
        })
    })

    describe('SUCCESS actions', () => {
        describe('adding the stream on GET_STREAM_SUCCESS, CREATE_STREAM_SUCCESS', () => {
            it('must add the stream if it does not exist', () => {
                [
                    actions.CREATE_STREAM_SUCCESS,
                    actions.GET_STREAM_SUCCESS,
                    actions.CREATE_STREAM_SUCCESS,
                    actions.GET_STREAM_SUCCESS,
                ].forEach((action) => {
                    const stream = {
                        id: 'moi',
                        field: 'hei',
                    }
                    expect(reducer({
                        ids: [],
                    }, {
                        type: action,
                        stream: stream.id,
                    })).toStrictEqual({
                        ids: [],
                        fetching: false,
                        error: null,
                    })
                })
            })

            it('must add the stream if it does not exist - UPDATE_STREAM_SUCCESS', () => {
                const stream = {
                    id: 'moi',
                    field: 'hei',
                }

                expect(reducer({
                    ids: [],
                }, {
                    type: actions.UPDATE_STREAM_SUCCESS,
                    stream: stream.id,
                })).toStrictEqual({
                    ids: [],
                    fetching: false,
                    updating: false,
                    error: null,
                })
            })

            it('must add the stream to existing streams list', () => {
                const expectedState = {
                    ...initialState,
                    error: null,
                    ids: [1, 2, 3, 4, 5],
                    hasMoreSearchResults: true,
                }

                const mockState = {
                    ...initialState,
                    ids: [1, 2, 3],
                    hasMoreSearchResults: true,
                }

                const reducerState = reducer(mockState, {
                    type: actions.GET_STREAMS_SUCCESS,
                    streams: [4, 5],
                    hasMoreResults: true,
                })

                expect(reducerState).toStrictEqual(expectedState)
            })

            it('clears product list', () => {
                const expectedState = {
                    ...initialState,
                    error: null,
                    ids: [],
                    hasMoreSearchResults: null,
                }

                const mockState = {
                    ...initialState,
                    error: {},
                    ids: [1, 2, 3],
                    hasMoreSearchResults: true,
                }

                const reducerState = reducer(mockState, {
                    type: actions.CLEAR_STREAM_LIST,
                })

                expect(reducerState).toStrictEqual(expectedState)
            })
        })

        describe(actions.UPDATE_STREAM_SUCCESS, () => {
            it('lowers the `updating` flag', () => {
                expect(reducer({
                    updating: true,
                }, {
                    type: actions.UPDATE_STREAM_SUCCESS,
                }).updating).toBe(false)
            })
        })

        describe('deleting the stream on DELETE_STREAM_SUCCESS', () => {
            const stream = {
                id: 'moi',
                field: 'moi',
            }
            const stream2 = {
                id: 'moi2',
                field: 'moi2',
            }
            expect(reducer({
                ids: [stream.id, stream2.id],
            }, {
                type: actions.DELETE_STREAM_SUCCESS,
                id: stream.id,
            })).toStrictEqual({
                ids: [stream2.id],
                fetching: false,
                error: null,
            })
        })
    })

    describe('FAILURE actions', () => {
        describe('it should add the error and set fetching = false on all FAILURE actions', () => {
            [
                actions.GET_STREAM_FAILURE,
                actions.CREATE_STREAM_FAILURE,
                actions.UPDATE_STREAM_FAILURE,
                actions.DELETE_STREAM_FAILURE,
            ].forEach((action) => {
                const error = {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                }

                const result = reducer({
                    fetching: true,
                    error: null,
                }, {
                    type: action,
                    error,
                })

                expect(result.fetching).toBe(false)
                expect(error).toStrictEqual(result.error)
            })
        })

        describe(actions.UPDATE_STREAM_FAILURE, () => {
            it('lowers the `updating` flag', () => {
                expect(reducer({
                    updating: true,
                }, {
                    type: actions.UPDATE_STREAM_FAILURE,
                }).updating).toBe(false)
            })
        })
    })
})
