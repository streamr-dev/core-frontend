import EventEmitter from 'events'
import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import Transaction from '$shared/utils/Transaction'
import * as actions from '$mp/modules/allowance/actions'
import * as constants from '$mp/modules/allowance/constants'
import * as services from '$mp/modules/allowance/services'
import * as transactionConstants from '$mp/modules/transactions/constants'
import * as entityConstants from '$shared/modules/entities/constants'

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

    describe('getDataAllowance', () => {
        it('gets data allowance succesfully', async () => {
            const allowance = '200000000000000000000'

            sandbox.stub(services, 'getMyDataAllowance').callsFake(() => Promise.resolve(allowance))

            await store.dispatch(actions.getDataAllowance())

            const expectedActions = [
                {
                    type: constants.GET_DATA_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.GET_DATA_ALLOWANCE_SUCCESS,
                    payload: {
                        dataAllowance: allowance,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const error = new Error('Error')
            sandbox.stub(services, 'getMyDataAllowance').callsFake(() => Promise.reject(error))

            await store.dispatch(actions.getDataAllowance())

            const expectedActions = [
                {
                    type: constants.GET_DATA_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.GET_DATA_ALLOWANCE_FAILURE,
                    error: true,
                    payload: error,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('setDataAllowance', () => {
        it('sets DATA allowance succesfully', async () => {
            const allowance = '200000000000000000000'
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)

            sandbox.stub(services, 'setMyDataAllowance').callsFake(() => tx)

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('receipt', receipt)
            }, 1000)

            await store.dispatch(actions.setDataAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_DATA_ALLOWANCE_REQUEST,
                    payload: {
                        dataAllowance: allowance,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    hash,
                                    type: 'setDataAllowance',
                                    state: 'pending',
                                },
                            },
                        },
                    },
                },
                {
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: constants.RECEIVE_SET_DATA_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.SET_DATA_ALLOWANCE_SUCCESS,
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const allowance = '200000000000000000000'
            const errorMsg = 'Error'

            sandbox.stub(services, 'setMyDataAllowance').callsFake(() => {
                throw new Error(errorMsg)
            })

            await store.dispatch(actions.setDataAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_DATA_ALLOWANCE_REQUEST,
                    payload: {
                        dataAllowance: allowance,
                    },
                },
                {
                    type: constants.SET_DATA_ALLOWANCE_FAILURE,
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

            sandbox.stub(services, 'setMyDataAllowance').callsFake(() => tx)

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('error', error)
            }, 1000)

            await store.dispatch(actions.setDataAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.SET_DATA_ALLOWANCE_REQUEST,
                    payload: {
                        dataAllowance: allowance,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    hash,
                                    type: 'setDataAllowance',
                                    state: 'pending',
                                },
                            },
                        },
                    },
                },
                {
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: constants.RECEIVE_SET_DATA_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.SET_DATA_ALLOWANCE_FAILURE,
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

    describe('resetDataAllowance', () => {
        it('resets DATA allowance succesfully', async () => {
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)

            sandbox.stub(services, 'setMyDataAllowance').callsFake(() => tx)

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('receipt', receipt)
            }, 1000)

            await store.dispatch(actions.resetDataAllowance())

            const expectedActions = [
                {
                    type: constants.RESET_DATA_ALLOWANCE_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    hash,
                                    type: 'resetDataAllowance',
                                    state: 'pending',
                                },
                            },
                        },
                    },
                },
                {
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: constants.RECEIVE_RESET_DATA_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.RESET_DATA_ALLOWANCE_SUCCESS,
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const allowance = '200000000000000000000'
            const errorMsg = 'Error'

            sandbox.stub(services, 'setMyDataAllowance').callsFake(() => {
                throw new Error(errorMsg)
            })

            await store.dispatch(actions.resetDataAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.RESET_DATA_ALLOWANCE_REQUEST,
                },
                {
                    type: constants.RESET_DATA_ALLOWANCE_FAILURE,
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

            sandbox.stub(services, 'setMyDataAllowance').callsFake(() => tx)

            setTimeout(() => {
                emitter.emit('transactionHash', hash)
            }, 500)
            setTimeout(() => {
                emitter.emit('error', error)
            }, 1000)

            await store.dispatch(actions.resetDataAllowance(allowance))

            const expectedActions = [
                {
                    type: constants.RESET_DATA_ALLOWANCE_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities: {
                            transactions: {
                                [hash]: {
                                    id: hash,
                                    hash,
                                    type: 'resetDataAllowance',
                                    state: 'pending',
                                },
                            },
                        },
                    },
                },
                {
                    type: transactionConstants.ADD_TRANSACTION,
                    payload: {
                        id: hash,
                    },
                },
                {
                    type: constants.RECEIVE_RESET_DATA_ALLOWANCE_HASH,
                    payload: {
                        hash,
                    },
                },
                {
                    type: constants.RESET_DATA_ALLOWANCE_FAILURE,
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
