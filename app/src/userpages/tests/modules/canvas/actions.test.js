import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import expect from 'expect'
import moxios from 'moxios'
import sinon from 'sinon'

import * as actions from '../../../modules/canvas/actions'
import * as entitiesActions from '$shared/modules/entities/actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Canvas actions', () => {
    let store
    let sandbox

    beforeEach(() => {
        moxios.install()
        store = mockStore({
            canvas: {
                filter: {
                    sortBy: 'sortTest',
                    search: 'searchTest',
                },
            },
        })
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        moxios.uninstall()
        store.clearActions()
    })

    it('creates GET_CANVASES_SUCCESS when fetching running canvases has succeeded', async () => {
        sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
            type: 'updateEntities',
        }))

        const wait = moxios.promiseWait().then(() => {
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(/canvases/)
            expect(request.config.params).toEqual({
                adhoc: false,
                sortBy: 'sortTest',
                order: 'desc',
                search: 'searchTest',
            })
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
            expect(request.config.params).toEqual({
                adhoc: false,
                sortBy: 'sortTest',
                order: 'desc',
                search: 'searchTest',
            })
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
                expect(store.getActions()).toEqual(expectedActions)
            })

        await wait
    })

    it('Sets a canvas opened', async () => {
        const expectedActions = [{
            type: actions.OPEN_CANVAS,
            id: 'test',
        }, {
            type: actions.GET_CANVAS_REQUEST,
            id: 'test',
        }]

        store.dispatch(actions.openCanvas('test'))
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('Updates the filter', async () => {
        const filter = {
            test: true,
        }

        const expectedActions = [{
            type: actions.UPDATE_FILTER,
            filter,
        }]

        store.dispatch(actions.updateFilter(filter))
        expect(store.getActions()).toEqual(expectedActions)
    })
})
