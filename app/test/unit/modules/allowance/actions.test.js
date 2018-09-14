import EventEmitter from 'events'
import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import Transaction from '../../../../src/utils/Transaction'
import * as actions from '../../../../src/modules/allowance/actions'
import * as constants from '../../../../src/modules/allowance/constants'
import * as services from '../../../../src/modules/allowance/services'
import * as transactionConstants from '../../../../src/modules/transactions/constants'
import * as entityConstants from '../../../../src/modules/entities/constants'

describe('allowance - actions', () => {
    let sandbox
    let store

    beforeAll(() => {
        store = mockStore()
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
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
            const receipt = {
                transactionHash: hash,
            }

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)

            sandbox.stub(services, 'setMyAllowance').callsFake(() => tx)

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
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    type: 'setAllowance',
                                    state: 'pending',
                                },
                            },
                        },
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
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const allowance = '200000000000000000000'
            const errorMsg = 'Error'

            sandbox.stub(services, 'setMyAllowance').callsFake(() => {
                throw new Error(errorMsg)
            })

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

            sandbox.stub(services, 'setMyAllowance').callsFake(() => tx)

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
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    type: 'setAllowance',
                                    state: 'pending',
                                },
                            },
                        },
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
                            message: 'txAborted',
                        },
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('resetAllowance', () => {
        it('resets allowance succesfully', async () => {
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)

            sandbox.stub(services, 'setMyAllowance').callsFake(() => tx)

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('receipt', receipt)
            }, 1000)

            await store.dispatch(actions.resetAllowance())

            const expectedActions = [
                {
                    type: constants.RESET_ALLOWANCE_REQUEST,
                },
                {
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    type: 'resetAllowance',
                                    state: 'pending',
                                },
                            },
                        },
                    },
                },
                {
                    type: constants.RECEIVE_RESET_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.RESET_ALLOWANCE_SUCCESS,
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const allowance = '200000000000000000000'
            const errorMsg = 'Error'

            sandbox.stub(services, 'setMyAllowance').callsFake(() => {
                throw new Error(errorMsg)
            })

            await store.dispatch(actions.resetAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.RESET_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.RESET_ALLOWANCE_FAILURE,
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

            sandbox.stub(services, 'setMyAllowance').callsFake(() => tx)

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('error', error)
            }, 1000)

            await store.dispatch(actions.resetAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.RESET_ALLOWANCE_REQUEST,
                },
                {
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    type: 'resetAllowance',
                                    state: 'pending',
                                },
                            },
                        },
                    },
                },
                {
                    type: constants.RECEIVE_RESET_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.RESET_ALLOWANCE_FAILURE,
                    payload: {
                        error: {
                            message: 'txAborted',
                        },
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
