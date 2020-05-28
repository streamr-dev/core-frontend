import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import moxios from 'moxios'

import * as actions from '../../../modules/permission/actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Permission actions', () => {
    let store

    beforeEach(() => {
        moxios.install()
        store = mockStore({
            permission: {
                byTypeAndId: {},
                error: null,
                fetching: false,
            },
        })
    })

    afterEach(() => {
        moxios.uninstall()
        store.clearActions()
    })

    describe('getApiUrl (tested indirectly)', () => {
        it('user correct url for dashboard', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            store.dispatch(actions.getResourcePermissions('DASHBOARD', id))
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`dashboards/${id}/permissions`)
            done()
            request.respondWith({
                status: 200,
            })
        })
        it('user correct url for canvas', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            store.dispatch(actions.getResourcePermissions('CANVAS', id))
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`canvases/${id}/permissions`)
            done()
            request.respondWith({
                status: 200,
            })
        })
        it('user correct url for stream', async (done) => {
            const id = 'afasdfasdfasgsdfg'
            store.dispatch(actions.getResourcePermissions('STREAM', id))
            await moxios.promiseWait()
            const request = moxios.requests.mostRecent()
            expect(request.url).toMatch(`streams/${id}/permissions`)
            done()
            request.respondWith({
                status: 200,
            })
        })
    })

    describe('getResourcePermissions', () => {
        it('creates GET_RESOURCE_PERMISSIONS_SUCCESS when fetching resources succeeded', async () => {
            const resourceType = 'DASHBOARD'
            const resourceId = 'asdfasdfasasd'
            const permissions = [{
                user: 'test',
                operation: 'test',
            }]
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${resourceId}/permissions`, {
                status: 200,
                response: permissions,
            })

            const expectedActions = [{
                type: actions.GET_RESOURCE_PERMISSIONS_REQUEST,
            }, {
                type: actions.GET_RESOURCE_PERMISSIONS_SUCCESS,
                resourceType,
                resourceId,
                permissions,
            }]

            await store.dispatch(actions.getResourcePermissions(resourceType, resourceId))
            expect(store.getActions()).toEqual(expectedActions)
        })
        it('creates GET_RESOURCE_PERMISSIONS_FAILURE with the error when fetching permissions failed', async (done) => {
            const resourceType = 'DASHBOARD'
            const resourceId = 'asdfasdfasasd'
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${resourceId}/permissions`, {
                status: 500,
                response: {
                    message: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.GET_RESOURCE_PERMISSIONS_REQUEST,
            }, {
                type: actions.GET_RESOURCE_PERMISSIONS_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.getResourcePermissions(resourceType, resourceId))
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions)
                done()
            }
        })
    })
})
