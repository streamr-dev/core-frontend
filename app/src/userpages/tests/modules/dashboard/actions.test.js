import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import moxios from 'moxios'
import sinon from 'sinon'

import * as originalActions from '$userpages/modules/dashboard/actions'
import * as entitiesActions from '$shared/modules/entities/actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Dashboard actions', () => {
    let store
    let actions
    let sandbox
    let oldStreamrApiUrl

    beforeEach(() => {
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        sandbox = sinon.createSandbox()
        moxios.install()
        store = mockStore({
            user: {
                user: {
                    username: 'testuser',
                },
            },
            dashboard: {
                error: null,
            },
            entities: {
                dashboards: {},
            },
        })
        actions = originalActions
    })

    afterEach(() => {
        moxios.uninstall()
        store.clearActions()
        sandbox.restore()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('getDashboards', () => {
        it('creates GET_DASHBOARDS_SUCCESS when fetching dashboards has succeeded', async () => {
            moxios.stubRequest(new RegExp(`${process.env.STREAMR_API_URL}/dashboards*`), {
                status: 200,
                response: [{
                    id: 'test',
                    name: 'test',
                }, {
                    id: 'test2',
                    name: 'test2',
                }],
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            const expectedActions = [{
                type: actions.GET_DASHBOARDS_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.GET_DASHBOARDS_SUCCESS,
                dashboards: ['test', 'test2'],
            }]

            await store.dispatch(actions.getDashboards())
            expect(store.getActions()).toEqual(expectedActions)
        })
        it('creates GET_ALL_INTEGRATION_KEYS_FAILURE when fetching integration keys has failed', async (done) => {
            moxios.stubRequest(new RegExp(`${process.env.STREAMR_API_URL}/dashboards*`), {
                status: 500,
                response: {
                    message: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.GET_DASHBOARDS_REQUEST,
            }, {
                type: actions.GET_DASHBOARDS_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.getDashboards())
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions)
                done()
            }
        })
    })

    describe('getDashboard', () => {
        it('creates GET_ALL_INTEGRATION_KEYS_FAILURE when fetching integration keys has failed', async (done) => {
            moxios.stubRequest(new RegExp(`${process.env.STREAMR_API_URL}/dashboards*`), {
                status: 500,
                response: {
                    message: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.GET_DASHBOARDS_REQUEST,
            }, {
                type: actions.GET_DASHBOARDS_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.getDashboards())
            } catch (e) {
                expect(store.getActions().slice(0, 2)).toMatchObject(expectedActions)
                done()
            }
        })
    })
})
