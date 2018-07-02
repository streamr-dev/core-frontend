import assert from 'assert-diff'
import reducer from '../../../modules/stream/reducer'
import * as actions from '../../../modules/stream/actions'

describe('Stream reducer', () => {
    it('should return the initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), {
            byId: {},
            openStream: {
                id: null,
            },
            fetching: false,
            error: null,
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
                assert.deepStrictEqual(reducer({
                    fetching: false,
                }, {
                    type: action,
                }), {
                    fetching: true,
                })
            })
        })
    })

    describe('SUCCESS actions', () => {
        describe('adding the stream on GET_STREAM_SUCCESS, CREATE_STREAM_SUCCESS', () => {
            it('must add the stream if it does not exist', () => {
                [
                    actions.CREATE_STREAM_SUCCESS,
                    actions.GET_STREAM_SUCCESS,
                ].forEach((action) => {
                    const stream = {
                        id: 'moi',
                        field: 'hei',
                    }
                    assert.deepStrictEqual(reducer({
                        byId: {},
                    }, {
                        type: action,
                        stream,
                    }), {
                        byId: {
                            moi: stream,
                        },
                        fetching: false,
                        error: null,
                    })
                })
            })
            it('must replace the stream if it does already exist', () => {
                [
                    actions.CREATE_STREAM_SUCCESS,
                    actions.GET_STREAM_SUCCESS,
                ].forEach((action) => {
                    const stream = {
                        id: 'moi',
                        field: 'hei',
                    }
                    assert.deepStrictEqual(reducer({
                        byId: {
                            moi: {
                                id: 'moi',
                                field: 'fjaslkfjasldfkjasdöflask',
                            },
                        },
                    }, {
                        type: action,
                        stream,
                    }), {
                        byId: {
                            moi: stream,
                        },
                        fetching: false,
                        error: null,
                    })
                })
            })
        })
        describe('updating the stream on UPDATE_STREAM_SUCCESS', () => {
            it('must update the existing stream', () => {
                const stream = {
                    id: 'moi',
                    field: 'moimoi',
                }
                assert.deepStrictEqual(reducer({
                    byId: {
                        moi: {
                            id: 'moi',
                            field: 'hei',
                            field2: 'heihei',
                        },
                    },
                }, {
                    type: actions.UPDATE_STREAM_SUCCESS,
                    stream,
                }), {
                    byId: {
                        moi: {
                            ...stream,
                            field2: 'heihei',
                        },
                    },
                    fetching: false,
                    error: null,
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
                byId: {
                    [stream.id]: stream,
                    [stream2.id]: stream2,
                },
            }, {
                type: actions.DELETE_STREAM_SUCCESS,
                id: stream.id,
            }), {
                byId: {
                    [stream2.id]: stream2,
                },
                fetching: false,
                error: null,
            })
        })
        describe('getting stream permissions', () => {
            it('should add the permissions for the stream', () => {
                const stream = {
                    id: 'moi',
                }
                const permissions = ['a', 'b', 'c']
                assert.deepStrictEqual(reducer({
                    byId: {
                        [stream.id]: stream,
                    },
                }, {
                    id: stream.id,
                    permissions,
                }), {
                    byId: {
                        [stream.id]: {
                            ...stream,
                            ownPermission: permissions,
                        },
                    },
                })
            })
            it('should use empty array if !permissions', () => {
                const stream = {
                    id: 'moi',
                }
                assert.deepStrictEqual(reducer({
                    byId: {
                        [stream.id]: stream,
                    },
                }, {
                    id: stream.id,
                    permissions: null,
                }), {
                    byId: {
                        [stream.id]: {
                            ...stream,
                            ownPermission: [],
                        },
                    },
                })
            })
        })
        describe('saving stream fields', () => {
            it('must update the fields of the stream', () => {
                const id = 'moi'
                const fields = [{
                    name: 'hei',
                    type: 'moi',
                }]
                assert.deepStrictEqual(reducer({
                    byId: {
                        [id]: {
                            id,
                        },
                    },
                }, {
                    type: actions.SAVE_STREAM_FIELDS_SUCCESS,
                    id,
                    fields,
                }), {
                    byId: {
                        [id]: {
                            id,
                            config: {
                                fields,
                            },
                        },
                    },
                    fetching: false,
                    error: null,
                })
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
                assert.deepStrictEqual(reducer({
                    fetching: true,
                    error: null,
                }, {
                    type: action,
                    error,
                }), {
                    fetching: false,
                    error,
                })
            })
        })
    })
})
