import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

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

    describe('updateCurrentUserName', () => {
        it('creates UPDATE_CURRENT_USER', async () => {
            const store = mockStore({
                user: {
                    user: {
                        id: 'test',
                        email: 'test2',
                        name: 'test3',
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
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('logout', () => {
        it('calls services.logout and handles error', async () => {
            const store = mockStore()

            await store.dispatch(actions.logout())

            const expectedActions = [
                {
                    type: constants.RESET_USER_DATA,
                },
                {
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        method: 'push',
                        args: [
                            `${process.env.PLATFORM_ORIGIN_URL}`,
                        ],
                    },
                },
            ]
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
            const serviceStub = sandbox.stub(services, 'putUser').callsFake(() => Promise.resolve(user))

            const expectedActions = [{
                type: constants.SAVE_CURRENT_USER_REQUEST,
            }, {
                type: constants.SAVE_CURRENT_USER_SUCCESS,
                payload: {
                    user,
                },
            }]

            await store.dispatch(actions.saveCurrentUser())
            assert(serviceStub.calledOnce)

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
            const serviceStub = sandbox.stub(services, 'putUser').callsFake(() => Promise.reject(error))

            const expectedActions = [{
                type: constants.SAVE_CURRENT_USER_REQUEST,
            }, {
                type: constants.SAVE_CURRENT_USER_FAILURE,
                error: true,
                payload: error,
            }]

            try {
                await store.dispatch(actions.saveCurrentUser())
            } catch (e) {
                assert(serviceStub.calledOnce)
                assert.deepStrictEqual(store.getActions(), expectedActions)
            }
        })
    })
})
