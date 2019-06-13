import assert from 'assert-diff'
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
                openDashboard: {
                    id: null,
                },
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
            assert.deepStrictEqual(store.getActions(), expectedActions)
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
                assert.deepStrictEqual(store.getActions().slice(0, 2), expectedActions)
                done()
            }
        })
    })

    describe('getDashboard', () => {
        it('creates GET_DASHBOARD_SUCCESS when fetching a dashboard has succeeded', async () => {
            const id = 'asdfasdfasasd'
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${id}`, {
                status: 200,
                response: {
                    id: 'test',
                    name: 'test',
                    layout: {
                        testing: true,
                    },
                },
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            const expectedActions = [{
                type: actions.GET_DASHBOARD_REQUEST,
                id,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.GET_DASHBOARD_SUCCESS,
            }]

            await store.dispatch(actions.getDashboard(id))
            assert.deepStrictEqual(store.getActions(), expectedActions)
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
                assert.deepStrictEqual(store.getActions().slice(0, 2), expectedActions)
                done()
            }
        })
    })

    describe('updateAndSaveDashboard', () => {
        it('creates UPDATE_AND_SAVE_DASHBOARD_SUCCESS when fetching a dashboard has succeeded', async () => {
            const id = 'test'
            const db = {
                id,
                name: 'test',
                layout: {
                    test: true,
                },
                ownPermissions: [],
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${id}`, {
                status: 200,
                response: db,
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: actions.UPDATE_AND_SAVE_DASHBOARD_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: actions.UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
            }]

            await store.dispatch(actions.updateAndSaveDashboard(db))
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
        it('creates also CHANGE_ID if the id has changed', async () => {
            const id = 'test'
            const db = {
                id,
                name: 'test',
                layout: {
                    test: true,
                },
                ownPermissions: [],
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${id}`, {
                status: 200,
                response: {
                    ...db,
                    id: 'new_test',
                },
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            const expectedActions = [{
                type: actions.UPDATE_AND_SAVE_DASHBOARD_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: 'updateEntities',
            }, {
                type: actions.CHANGE_DASHBOARD_ID,
                oldId: 'test',
                newId: 'new_test',
            }, {
                type: actions.UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
            }]
            await store.dispatch(actions.updateAndSaveDashboard(db))
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
        it('creates UPDATE_AND_SAVE_DASHBOARD_FAILURE when fetching a dashboard has failed', async (done) => {
            const id = 'test'
            const db = {
                id,
                name: 'test',
                layout: {
                    test: true,
                },
            }
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${id}`, {
                status: 500,
                response: {
                    message: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                type: actions.UPDATE_AND_SAVE_DASHBOARD_REQUEST,
            }, {
                type: actions.UPDATE_AND_SAVE_DASHBOARD_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(actions.updateAndSaveDashboard(db))
            } catch (e) {
                assert.deepStrictEqual(store.getActions()[0], expectedActions[0])
                assert.deepStrictEqual(store.getActions()[1], expectedActions[1])
                done()
            }
        })
        it('uses POST request if dashboard.new = true', async () => {
            const wait = moxios.promiseWait()
                .then(() => {
                    const request = moxios.requests.mostRecent()
                    assert.equal(request.url, `${process.env.STREAMR_API_URL}/dashboards`)
                    assert.equal(request.config.method.toLowerCase(), 'post')
                    request.respondWith({
                        status: 200,
                        response: request.config.data,
                    })
                })
            store.dispatch(originalActions.updateAndSaveDashboard({
                id: 'test',
                layout: 'test',
                new: true,
            }))
            await wait
        })
        it('uses PUT request if dashboard.new = false', async () => {
            const id = 'test'
            const wait = moxios.promiseWait()
                .then(() => {
                    const request = moxios.requests.mostRecent()
                    assert.equal(request.url, `${process.env.STREAMR_API_URL}/dashboards/${id}`)
                    assert.equal(request.config.method.toLowerCase(), 'put')
                    request.respondWith({
                        status: 200,
                        response: request.config.data,
                    })
                })

            store.dispatch(originalActions.updateAndSaveDashboard({
                id,
                layout: 'test',
                new: false,
            }))

            await wait
        })
    })

    describe('deleteDashboard', () => {
        it('creates DELETE_DASHBOARD_SUCCESS when deleting dashboard has succeeded', async () => {
            const wait = moxios.promiseWait()
                .then(() => {
                    const request = moxios.requests.mostRecent()
                    assert.equal(request.config.method, 'delete')
                    request.respondWith({
                        status: 200,
                    })
                })

            const expectedActions = [{
                type: originalActions.DELETE_DASHBOARD_REQUEST,
                id: 'test',
            }, {
                type: originalActions.DELETE_DASHBOARD_SUCCESS,
                id: 'test',
            }]

            await store.dispatch(originalActions.deleteDashboard('test'))
            assert.deepStrictEqual(store.getActions(), expectedActions)
            await wait
        })

        it('creates DELETE_DASHBOARD_FAILURE when deleting dashboard has failed', async () => {
            const wait = moxios.promiseWait()
                .then(() => {
                    const request = moxios.requests.mostRecent()
                    assert.equal(request.config.method, 'delete')
                    request.respondWith({
                        status: 500,
                        response: {
                            message: 'test',
                            code: 'TEST',
                        },
                    })
                })

            const expectedActions = [{
                type: originalActions.DELETE_DASHBOARD_REQUEST,
                id: 'test',
            }, {
                type: originalActions.DELETE_DASHBOARD_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(originalActions.deleteDashboard('test'))
            } catch (e) {
                assert.deepStrictEqual(store.getActions().slice(0, 2), expectedActions)
            }

            await wait
        })
    })

    describe('getMyDashboardPermissions', () => {
        it('creates GET_MY_DASHBOARD_PERMISSIONS_SUCCESS with the operations when fetching permissions has succeeded', async () => {
            const id = 'asdfasdfasasd'
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${id}/permissions/me`, {
                status: 200,
                response: [{
                    user: 'testuser',
                    operation: 'test',
                }, {
                    user: 'testuser',
                    operation: 'test2',
                }],
            })
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            const expectedActions = [{
                id,
                type: originalActions.GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
            }, {
                id,
                type: originalActions.GET_MY_DASHBOARD_PERMISSIONS_SUCCESS,
            }, {
                type: 'updateEntities',
            }]

            await store.dispatch(originalActions.getMyDashboardPermissions(id))
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
        it('creates GET_MY_DASHBOARD_PERMISSIONS_FAILURE when fetching permissions has failed', async (done) => {
            const id = 'asdfasdfasasd'
            moxios.stubRequest(`${process.env.STREAMR_API_URL}/dashboards/${id}/permissions/me`, {
                status: 500,
                response: {
                    message: 'test',
                    code: 'TEST',
                },
            })

            const expectedActions = [{
                id,
                type: originalActions.GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
            }, {
                id,
                type: originalActions.GET_MY_DASHBOARD_PERMISSIONS_FAILURE,
                error: {
                    message: 'test',
                    code: 'TEST',
                    statusCode: 500,
                },
            }]

            try {
                await store.dispatch(originalActions.getMyDashboardPermissions(id))
            } catch (e) {
                assert.deepStrictEqual(store.getActions().slice(0, 2), expectedActions)
                done()
            }
        })
    })

    describe('updateDashboard', () => {
        it('must update the entities', () => {
            const updateEntitiesStub = sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            store.dispatch(originalActions.updateDashboard({
                id: 'test',
            }))
            const expectedActions = [{
                type: 'updateEntities',
            }]
            assert(updateEntitiesStub.calledOnce)
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        describe('addDashboardItem', () => {
            it('must update the entities', () => {
                const db = {
                    id: 'test',
                    items: [{
                        canvas: 'a',
                        module: 0,
                        thirdField: 'a',
                    }],
                }
                sandbox.stub(entitiesActions, 'updateEntities').callsFake((entities) => ({
                    type: 'updateEntities',
                    dashboard: entities.dashboards.test,
                }))
                store.dispatch(originalActions.addDashboardItem(db, {
                    canvas: 'b',
                    module: 0,
                    thirdField: 'test',
                }))

                const expectedActions = [{
                    type: 'updateEntities',
                    dashboard: {
                        id: 'test',
                        items: [{
                            canvas: 'a',
                            module: 0,
                            thirdField: 'a',
                        }, {
                            canvas: 'b',
                            module: 0,
                            thirdField: 'test',
                        }],
                        saved: false,
                    },
                }]
                assert.deepStrictEqual(store.getActions(), expectedActions)
            })
        })

        describe('updateDashboardItem', () => {
            it('must update the entities', () => {
                const db = {
                    id: 'test',
                    items: [{
                        canvas: 'a',
                        module: 0,
                        thirdField: 'a',
                    }, {
                        canvas: 'b',
                        module: 0,
                        thirdField: 'a',
                    }],
                }
                sandbox.stub(entitiesActions, 'updateEntities').callsFake((entities) => ({
                    type: 'updateEntities',
                    dashboard: entities.dashboards.test,
                }))

                store.dispatch(originalActions.updateDashboardItem(db, {
                    canvas: 'b',
                    module: 0,
                    thirdField: 'test',
                }))
                const expectedActions = [{
                    type: 'updateEntities',
                    dashboard: {
                        id: 'test',
                        items: [{
                            canvas: 'a',
                            module: 0,
                            thirdField: 'a',
                        }, {
                            canvas: 'b',
                            module: 0,
                            thirdField: 'test',
                        }],
                        saved: false,
                    },
                }]
                assert.deepStrictEqual(store.getActions(), expectedActions)
            })
        })

        describe('removeDashboardItem', () => {
            it('must update the entities', () => {
                sandbox.stub(entitiesActions, 'updateEntities').callsFake((entities) => ({
                    type: 'updateEntities',
                    dashboard: entities.dashboards.test,
                }))

                store.dispatch(originalActions.removeDashboardItem({
                    id: 'test',
                    items: [{
                        canvas: 'a',
                        module: 0,
                        thirdField: 'a',
                    }, {
                        canvas: 'b',
                        module: 0,
                        thirdField: 'a',
                    }],
                }, {
                    canvas: 'b',
                    module: 0,
                    thirdField: 'test',
                }))

                const expectedActions = [{
                    type: 'updateEntities',
                    dashboard: {
                        id: 'test',
                        items: [{
                            canvas: 'a',
                            module: 0,
                            thirdField: 'a',
                        }],
                        saved: false,
                    },
                }]

                assert.deepStrictEqual(store.getActions(), expectedActions)
            })
        })
    })

    describe('updateDashboardChanges', () => {
        it('must update the entities', async () => {
            store = mockStore({
                dashboard: {
                    ...store.getState().dashboard,
                    ids: ['test'],
                    openDashboard: {
                        id: 'test',
                    },
                },
                entities: {
                    dashboards: {
                        test: {
                            id: 'test',
                            name: 'test',
                            name2: 'test2',
                        },
                    },
                },
            })

            sandbox.stub(entitiesActions, 'updateEntities').callsFake((entities) => ({
                type: 'updateEntities',
                dashboard: entities.dashboards.test,
            }))

            const expectedActions = [{
                type: 'updateEntities',
                dashboard: {
                    id: 'test',
                    name: 'test3',
                    name2: 'test2',
                    saved: false,
                },
            }]
            await store.dispatch(originalActions.updateDashboardChanges('test', {
                name: 'test3',
            }))
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('openDashboard', () => {
        const id = 'test'
        it('must return correct action', () => {
            assert.deepStrictEqual(originalActions.openDashboard(id), {
                type: originalActions.OPEN_DASHBOARD,
                id,
            })
        })
    })
})
