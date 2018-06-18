import EventEmitter from 'events'
import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import Transaction from '../../../../src/utils/Transaction'
import * as actions from '../../../../src/modules/allowance/actions'
import * as constants from '../../../../src/modules/allowance/constants'
import * as services from '../../../../src/modules/allowance/services'

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
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const error = new Error('Error')
            sandbox.stub(services, 'getMyAllowance').callsFake(() => Promise.reject(error))

            await store.dispatch(actions.getAllowance())

            const expectedActions = [
                {
                    type: constants.GET_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.GET_ALLOWANCE_FAILURE,
                    error: true,
                    payload: error,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
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

            assert.deepStrictEqual(store.getActions(), expectedActions)
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
            assert.deepStrictEqual(store.getActions(), expectedActions)
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
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
