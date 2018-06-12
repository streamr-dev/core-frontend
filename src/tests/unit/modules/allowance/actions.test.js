import EventEmitter from 'events'
import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import Transaction from '../../../../utils/Transaction'
import * as actions from '../../../../modules/allowance/actions'
import * as constants from '../../../../modules/allowance/constants'
import * as services from '../../../../modules/allowance/services'

describe('allowance - actions', () => {
    let sandbox
    let store

    beforeAll(() => {
        store = mockStore()
    })

    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
        store.clearActions()
    })

    describe('getAllowance', () => {
        it('gets allowance succesfully', async () => {
            const allowance = '200000000000000000000'

            sandbox.stub(services, 'getMyAllowance').callsFake(() => Promise.resolve(allowance))

            await store.dispatch(actions.getAllowance())

            const expectedActions = [
                {
                    type: constants.GET_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.GET_ALLOWANCE_SUCCESS,
                    payload: {
                        allowance,
                    },
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            sandbox.stub(services, 'getMyAllowance').callsFake(() => Promise.reject(new Error('Error')))

            await store.dispatch(actions.getAllowance())

            const expectedActions = [
                {
                    type: constants.GET_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.GET_ALLOWANCE_FAILURE,
                    error: true,
                    payload: {},
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    describe('setAllowance', () => {
        it('sets allowance succesfully', async () => {
            const allowance = '200000000000000000000'
            const hash = 'test'
            const receipt = 'done'

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)

            sandbox.stub(services, 'setMyAllowance').callsFake(() => Promise.resolve(tx))

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('receipt', receipt)
            }, 1000)

            await store.dispatch(actions.setAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_ALLOWANCE_REQUEST,
                    payload: {
                        allowance,
                    },
                },
                {
                    type: constants.RECEIVE_SET_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.SET_ALLOWANCE_SUCCESS,
                    payload: {
                        receipt,
                    },
                },
            ]

            assert.deepEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const allowance = '200000000000000000000'
            const errorMsg = 'Error'

            sandbox.stub(services, 'setMyAllowance').callsFake(() => Promise.reject(new Error(errorMsg)))

            await store.dispatch(actions.setAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_ALLOWANCE_REQUEST,
                    payload: {
                        allowance,
                    },
                },
                {
                    type: constants.SET_ALLOWANCE_FAILURE,
                    payload: {
                        error: {
                            message: errorMsg,
                        },
                    },
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })

        it('responds to transaction errors', async () => {
            const allowance = '200000000000000000000'
            const hash = 'test'
            const error = 'Transaction aborted'

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)

            sandbox.stub(services, 'setMyAllowance').callsFake(() => Promise.resolve(tx))

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('error', error)
            }, 1000)

            await store.dispatch(actions.setAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_ALLOWANCE_REQUEST,
                    payload: {
                        allowance,
                    },
                },
                {
                    type: constants.RECEIVE_SET_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.SET_ALLOWANCE_FAILURE,
                    payload: {
                        error: {
                            message: error,
                        },
                    },
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })
})
