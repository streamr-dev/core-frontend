import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'
// import { CALL_HISTORY_METHOD } from 'react-router-redux'

import * as actions from '$shared/modules/user/actions'
import * as constants from '$shared/modules/user/constants'
import * as services from '$shared/modules/user/services'

describe('user - actions', () => {
    let sandbox
    let oldStreamrApiUrl

    beforeEach(() => {
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('getUserData', () => {
        it('calls services.getUserData and updates user data', async () => {
            const data = {
                name: 'Tester1',
                username: 'tester1@streamr.com',
                timezone: 'Zulu',
            }

            const serviceStub = sandbox.stub(services, 'getUserData').callsFake(() => Promise.resolve(data))

            const store = mockStore()
            await store.dispatch(actions.getUserData())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.USER_DATA_REQUEST,
                },
                {
                    type: constants.USER_DATA_SUCCESS,
                    payload: {
                        user: data,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.getUserData and handles error', async () => {
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'getUserData').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.getUserData())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.USER_DATA_REQUEST,
                },
                {
                    type: constants.USER_DATA_FAILURE,
                    error: true,
                    payload: error,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('startExternalLogin', () => {
        it('sends external login start action', () => {
            const store = mockStore()
            store.dispatch(actions.startExternalLogin())

            const expectedActions = [
                {
                    type: constants.EXTERNAL_LOGIN_START,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('endExternalLogin', () => {
        it('sends external login end action', () => {
            const store = mockStore()
            store.dispatch(actions.endExternalLogin())

            const expectedActions = [
                {
                    type: constants.EXTERNAL_LOGIN_END,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('updateCurrentUserName', () => {
        it('creates UPDATE_CURRENT_USER', async () => {
            const store = mockStore({
                user: {
                    user: {
                        id: 'test',
                        email: 'test2',
                        name: 'test3',
                        timezone: 'test4',
                    },
                },
            })
            await store.dispatch(actions.updateCurrentUserName('test5'))
            const expectedActions = [{
                type: constants.UPDATE_CURRENT_USER,
                payload: {
                    user: {
                        id: 'test',
                        email: 'test2',
                        name: 'test5',
                        timezone: 'test4',
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('updateCurrentUserTimezone', () => {
        it('creates UPDATE_CURRENT_USER', async () => {
            const store = mockStore({
                user: {
                    user: {
                        id: 'test',
                        email: 'test2',
                        name: 'test3',
                        timezone: 'test4',
                    },
                },
            })
            await store.dispatch(actions.updateCurrentUserTimezone('test5'))
            const expectedActions = [{
                type: constants.UPDATE_CURRENT_USER,
                payload: {
                    user: {
                        id: 'test',
                        email: 'test2',
                        name: 'test3',
                        timezone: 'test5',
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
    describe('logout', () => {
        it('calls services.logout and handles error', async () => {
            const serviceStub = sandbox.stub(services, 'logout').callsFake(() => Promise.resolve())
            const windowReplaceStub = sandbox.stub(window.location, 'replace')
            const store = mockStore()

            await store.dispatch(actions.logout())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.LOGOUT_REQUEST,
                },
                {
                    type: constants.LOGOUT_SUCCESS,
                },
                // NOTE: Uncomment the following when the backend auth stuff is fixed. — Mariusz
                // {
                //     type: CALL_HISTORY_METHOD,
                //     payload: {
                //         method: 'replace',
                //         args: [
                //             '/',
                //         ],
                //     },
                // },
            ]
            sinon.assert.calledWithMatch(windowReplaceStub, /\/logout$/)
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('saveCurrentUser', () => {
        it('creates SAVE_CURRENT_USER_SUCCESS when saving user succeeded', async () => {
            const user = {
                id: '1',
                name: 'tester',
                email: 'test@tester.test',
            }
            const store = mockStore({
                user: {
                    user,
                },
            })
            const serviceStub = sandbox.stub(services, 'postUser').callsFake(() => Promise.resolve(user))

            const expectedActions = [{
                type: constants.SAVE_CURRENT_USER_REQUEST,
            }, {
                type: constants.SAVE_CURRENT_USER_SUCCESS,
                payload: {
                    user,
                },
            }]

            await store.dispatch(actions.saveCurrentUser(user, true))
            assert(serviceStub.calledOnce)

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.logout and handles error', async () => {
            const error = new Error('logout error')
            const serviceStub = sandbox.stub(services, 'logout').callsFake(() => Promise.reject(error))
            const store = mockStore()

            await store.dispatch(actions.logout())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.LOGOUT_REQUEST,
                },
                {
                    type: constants.LOGOUT_FAILURE,
                    error: true,
                    payload: error,
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
        it('creates SAVE_CURRENT_USER_FAILURE when saving user failed', async () => {
            const user = {
                id: '1',
                name: 'tester',
                email: 'test@tester.test',
            }
            const store = mockStore({
                user: {
                    user,
                },
            })
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'postUser').callsFake(() => Promise.reject(error))

            const expectedActions = [{
                type: constants.SAVE_CURRENT_USER_REQUEST,
            }, {
                type: constants.SAVE_CURRENT_USER_FAILURE,
                error: true,
                payload: error,
            }]

            try {
                await store.dispatch(actions.saveCurrentUser(user, true))
            } catch (e) {
                assert(serviceStub.calledOnce)
                assert.deepStrictEqual(store.getActions(), expectedActions)
            }
        })
    })
})
