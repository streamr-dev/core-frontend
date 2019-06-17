import assert from 'assert-diff'
import reducer from '$userpages/modules/userPageStreams/reducer'
import * as actions from '$userpages/modules/userPageStreams/actions'

describe('Stream reducer', () => {
    it('should return the initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), {
            ids: [],
            openStream: {
                id: null,
            },
            savingStreamFields: false,
            fetching: false,
            error: null,
            csvUpload: null,
            filter: null,
            editedStream: null,
            deleteDataError: null,
            autodetectFetching: false,
            streamFieldAutodetectError: null,
            permissions: null,
        })
    })

    describe('REQUEST actions', () => {
        it('should set fetching = true on all REQUEST actions', () => {
            [
                actions.GET_STREAM_REQUEST,
                actions.CREATE_STREAM_REQUEST,
                actions.UPDATE_STREAM_REQUEST,
                actions.GET_MY_STREAM_PERMISSIONS_REQUEST,
                actions.DELETE_STREAM_REQUEST,
                actions.SAVE_STREAM_FIELDS_REQUEST,
            ].forEach((action) => {
                assert.ok(reducer({
                    fetching: false,
                }, {
                    type: action,
                }).fetching, action)
            })
        })
    })

    describe('SUCCESS actions', () => {
        describe('adding the stream on GET_STREAM_SUCCESS, CREATE_STREAM_SUCCESS', () => {
            it('must add the stream if it does not exist', () => {
                [
                    actions.CREATE_STREAM_SUCCESS,
                    actions.GET_STREAM_SUCCESS,
                    actions.SAVE_STREAM_FIELDS_SUCCESS,
                    actions.UPDATE_STREAM_SUCCESS,
                    actions.CREATE_STREAM_SUCCESS,
                    actions.GET_STREAM_SUCCESS,
                ].forEach((action) => {
                    const stream = {
                        id: 'moi',
                        field: 'hei',
                    }
                    assert.deepStrictEqual(reducer({
                        ids: [],
                    }, {
                        type: action,
                        stream: stream.id,
                    }), {
                        ids: [],
                        fetching: false,
                        error: null,
                    })
                })
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
            assert.deepStrictEqual(reducer({
                ids: [stream.id, stream2.id],
            }, {
                type: actions.DELETE_STREAM_SUCCESS,
                id: stream.id,
            }), {
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
                actions.GET_MY_STREAM_PERMISSIONS_FAILURE,
                actions.DELETE_STREAM_FAILURE,
                actions.SAVE_STREAM_FIELDS_FAILURE,
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

                assert.ok(!result.fetching)
                assert.deepEqual(error, result.error)
            })
        })
    })
})
