import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'

import * as entitiesActions from '$shared/modules/entities/actions'
import * as actions from '../../../modules/canvas/actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Canvas actions', () => {
    let store

    beforeEach(() => {
        moxios.install()
        store = mockStore({
            canvas: {},
        })
    })

    afterEach(() => {
        moxios.uninstall()
        store.clearActions()
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('creates GET_CANVASES_SUCCESS when fetching running canvases has succeeded', async () => {
        jest.spyOn(entitiesActions, 'updateEntities').mockImplementation(() => ({
            type: 'updateEntities',
        }))

        const wait = moxios.promiseWait().then(() => {
            const request = moxios.requests.mostRecent()

            expect(request.url).toMatch(/canvases/)
            expect(request.url.indexOf('adhoc=false')).toBeTruthy()
            expect(request.url.indexOf('order=desc')).toBeTruthy()
            expect(request.url.indexOf('sortBy=lastUpdated')).toBeTruthy()

            request.respondWith({
                status: 200,
                response: [{
                    id: 'test',
                    name: 'test',
                }, {
                    id: 'test2',
                    name: 'test2',
                }],
            })
        })

        const expectedActions = [{
            type: actions.GET_CANVASES_REQUEST,
        }, {
            type: 'updateEntities',
        }, {
            type: actions.GET_CANVASES_SUCCESS,
            canvases: ['test', 'test2'],
        }]

        await store.dispatch(actions.getCanvases())

        expect(store.getActions()).toEqual(expectedActions)

        await wait
    })

    it('creates GET_CANVASES_FAILURE when fetching running canvases has failed', async () => {
        const wait = moxios.promiseWait().then(() => {
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(/canvases/)
            expect(request.url.indexOf('adhoc=false')).toBeTruthy()
            expect(request.url.indexOf('order=desc')).toBeTruthy()
            expect(request.url.indexOf('sortBy=lastUpdated')).toBeTruthy()
            request.respondWith({
                status: 500,
                response: {
                    message: 'test',
                    code: 'TEST',
                },
            })
        })

        const expectedActions = [{
            type: actions.GET_CANVASES_REQUEST,
        }, {
            type: actions.GET_CANVASES_FAILURE,
            error: {
                message: 'test',
                code: 'TEST',
                statusCode: 500,
            },
        }]

        await store.dispatch(actions.getCanvases())
            .catch(() => {
                expect(store.getActions()).toMatchObject(expectedActions)
            })

        await wait
    })

    it('Updates the filter', async () => {
        jest.spyOn(entitiesActions, 'updateEntities').mockImplementation(() => ({
            type: 'updateEntities',
        }))

        const wait = moxios.promiseWait().then(() => {
            const request = moxios.requests.mostRecent()

            expect(request.url).toMatch(/canvases/)
            expect(request.url.indexOf('adhoc=false')).toBeTruthy()
            expect(request.url.indexOf('order=desc')).toBeTruthy()
            expect(request.url.indexOf('sortBy=sortTest')).toBeTruthy()
            expect(request.url.indexOf('search=searchTest')).toBeTruthy()

            request.respondWith({
                status: 200,
                response: [{
                    id: 'test',
                    name: 'test',
                }, {
                    id: 'test2',
                    name: 'test2',
                }],
            })
        })

        const expectedActions = [{
            type: actions.GET_CANVASES_REQUEST,
        }, {
            type: 'updateEntities',
        }, {
            type: actions.GET_CANVASES_SUCCESS,
            canvases: ['test', 'test2'],
        }]

        await store.dispatch(actions.getCanvases({
            sortBy: 'sortTest',
            search: 'searchTest',
        }))

        expect(store.getActions()).toEqual(expectedActions)

        await wait
    })
})
