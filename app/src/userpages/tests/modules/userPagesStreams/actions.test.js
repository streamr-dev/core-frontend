import expect from 'expect'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import sinon from 'sinon'
import moxios from 'moxios'

import * as actions from '$userpages/modules/userPageStreams/actions'
import * as entitiesActions from '$shared/modules/entities/actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Stream actions', () => {
    let store
    let sandbox
    let oldStreamrApiUrl

    beforeEach(() => {
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        moxios.install()
        sandbox = sinon.createSandbox()
        store = mockStore({
            ids: [],
            openStream: {
                id: null,
            },
            error: null,
        })
    })

    afterEach(() => {
        moxios.uninstall()
        sandbox.restore()
        store.clearActions()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('createStream', () => {
        it('creates CREATE_STREAM_SUCCESS when creating stream has succeeded', async () => {
            const stream = {
                id: 'test',
                name: 'test',
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams`, {
                status: 200,
                response: stream,
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: actions.CREATE_STREAM_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.CREATE_STREAM_SUCCESS,
                stream: 'test',
            }]

            await store.dispatch(actions.createStream(stream))
            expect(store.getActions()).toEqual(expectedActions)
        })
        it('creates CREATE_STREAM_FAILURE when creating stream has failed', async () => {
            const stream = {
                name: 'test',
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams`, {
                status: 500,
                response: {
                    error: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.CREATE_STREAM_REQUEST,
            }, {
                type: actions.CREATE_STREAM_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.createStream(stream))
                expect(false).toBe(true) // fail on purpose because action did not throw
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions.slice(0, 2))
            }
        })
    })

    describe('getStream', () => {
        it('creates GET_STREAM_SUCCESS when fetching a stream has succeeded', async () => {
            const id = 'asdfasdfasasd'
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${id}`, {
                status: 200,
                response: {
                    id: 'test',
                    name: 'test',
                },
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: actions.GET_STREAM_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.GET_STREAM_SUCCESS,
                stream: 'test',
            }]
            await store.dispatch(actions.getStream(id))
            expect(store.getActions()).toEqual(expectedActions)
        })
        it('creates GET_STREAM_FAILURE when fetching stream has failed', async () => {
            const id = 'asdfasdfasasd'
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${id}`, {
                status: 500,
                response: {
                    error: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.GET_STREAM_REQUEST,
            }, {
                type: actions.GET_STREAM_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.getStream(id))
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions)
            }
        })
    })

    describe('updateStream', () => {
        it('creates UPDATE_STREAM_SUCCESS and CREATE_NOTIFICATION when updating a stream has succeeded', async () => {
            const id = 'test'
            const stream = {
                id,
                name: 'test',
                ownPermissions: [],
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${id}`, {
                status: 200,
                response: stream,
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: actions.UPDATE_STREAM_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.UPDATE_STREAM_SUCCESS,
                stream,
            }]

            await store.dispatch(actions.updateStream(stream))
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions.slice(0, 2))
        })
        it('creates UPDATE_STREAM_FAILURE and CREATE_NOTIFICATION when updating a stream has failed', async () => {
            const id = 'test'
            const db = {
                id,
                name: 'test',
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${id}`, {
                status: 500,
                response: {
                    error: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.UPDATE_STREAM_REQUEST,
            }, {
                type: actions.UPDATE_STREAM_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.updateStream(db))
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions.slice(0, 2))
            }
        })
        it('uses PUT request', async () => {
            const id = 'test'

            store.dispatch(actions.updateStream({
                id,
            }))
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toEqual(`${process.env.STREAMR_API_URL}/streams/${id}`)
            expect(request.config.method.toLowerCase()).toEqual('put')
        })
    })

    describe('deleteStream', () => {
        it('uses DELETE request', async () => {
            const stream = {
                id: 'asdfjasldfjasödf',
            }
            store.dispatch(actions.deleteStream(stream.id))
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toEqual(`${process.env.STREAMR_API_URL}/streams/${stream.id}`)
            expect(request.config.method.toLowerCase()).toEqual('delete')
        })
        it('creates DELETE_STREAM_SUCCESS when deleting stream has succeeded', async () => {
            const stream = {
                id: 'asdfjasldfjasödf',
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${stream.id}`, {
                status: 200,
            })

            const expectedActions = [{
                type: actions.DELETE_STREAM_REQUEST,
            }, {
                type: actions.DELETE_STREAM_SUCCESS,
                id: stream.id,
            }]

            await store.dispatch(actions.deleteStream(stream.id))
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions.slice(0, 2))
        })
        it('creates DELETE_STREAM_FAILURE when deleting stream has failed', async () => {
            const stream = {
                id: 'asdfjasldfjasödf',
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${stream.id}`, {
                status: 500,
                response: {
                    error: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.DELETE_STREAM_REQUEST,
            }, {
                type: actions.DELETE_STREAM_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]
            try {
                await store.dispatch(actions.deleteStream(stream.id))
                expect(false).toBe(true) // fail on purpose because action did not throw
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions.slice(0, 2))
            }
        })
    })

    describe('saveFields', () => {
        it('uses POST request', async () => {
            const id = 'fjasdlfjasdlkfj'
            const fields = [{
                name: 'moi',
                type: 'string',
            }, {
                name: 'moimoi',
                type: 'number',
            }]

            store.dispatch(actions.saveFields(id, fields))
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toEqual(`${process.env.STREAMR_API_URL}/streams/${id}/fields`)
            expect(request.config.method).toEqual('post')
            expect(JSON.parse(request.config.data)).toEqual(fields)
        })
        it('creates SAVE_STREAM_FIELDS_SUCCESS when saving fields has succeeded', async () => {
            const id = 'sfasldkfjsaldkfj'
            const fields = [{
                name: 'moi',
                type: 'string',
            }, {
                name: 'moimoi',
                type: 'number',
            }]
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${id}/fields`, {
                status: 200,
                response: fields,
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: actions.SAVE_STREAM_FIELDS_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.SAVE_STREAM_FIELDS_SUCCESS,
                id,
                fields,
            }]

            await store.dispatch(actions.saveFields(id, fields))
            expect(store.getActions().slice(0, 2)).toEqual(expectedActions.slice(0, 2))
        })
        it('creates SAVE_STREAM_FIELDS_FAILURE when saving fields has failed', async () => {
            const id = 'sfasldkfjsaldkfj'
            const fields = [{
                name: 'moi',
                type: 'string',
            }, {
                name: 'moimoi',
                type: 'number',
            }]
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/streams/${id}/fields`, {
                status: 500,
                response: {
                    error: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.SAVE_STREAM_FIELDS_REQUEST,
            }, {
                type: actions.SAVE_STREAM_FIELDS_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.saveFields(id, fields))
                expect(false).toBe(true) // fail on purpose because action did not throw
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions.slice(0, 2))
            }
        })
    })

    it('must dispatch OPEN_STREAM when opening stream', () => {
        const id = 'askdfjasldkfjasdlkf'
        expect(actions.openStream(id)).toEqual({
            type: actions.OPEN_STREAM,
            id,
        })
    })
})
