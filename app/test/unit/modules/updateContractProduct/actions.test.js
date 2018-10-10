import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$mp/modules/updateContractProduct/actions'
import * as constants from '$mp/modules/updateContractProduct/constants'
import * as services from '$mp/modules/createContractProduct/services'
import * as transactionActions from '$mp/modules/transactions/actions'
import { transactionTypes } from '$mp/utils/constants'

// Only affects this test file
jest.setTimeout(6000)

describe('updateContractProduct - actions', () => {
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

    describe('updateContractProduct', () => {
        it('calls services.updateContractProduct', () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: () => cc,
            }
            const ccStub = sandbox.stub(services, 'updateContractProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.updateContractProduct(id, product))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(product))
        })

        it('dispatches right actions on updateContractProduct().onTransactionHash', () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const hash = 'testHash'
            const cc = {
                onTransactionHash: (cb) => {
                    cb(hash)
                    return cc
                },
                onTransactionComplete: () => cc,
                onError: () => cc,
            }
            sandbox.stub(services, 'updateContractProduct').callsFake(() => cc)
            const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction').callsFake(() => ({
                type: 'addTransaction',
            }))
            const store = mockStore()
            store.dispatch(actions.updateContractProduct(id, product))
            const expectedActions = [{
                type: constants.UPDATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
                payload: {
                    hash,
                },
            }, {
                type: 'addTransaction',
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(addTransactionStub.calledWith(hash, transactionTypes.UPDATE_CONTRACT_PRODUCT))
        })

        it('dispatches right actions on updateContractProduct().onTransactionComplete', (done) => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const receipt = {
                a: 'receipt',
                with: 'no',
                proper: 'schema',
            }

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: (cb) => {
                    cb(receipt)
                    return cc
                },
                onError: () => cc,
            }
            sandbox.stub(services, 'updateContractProduct').callsFake(() => cc)

            const store = mockStore()
            store.dispatch(actions.updateContractProduct(id, product))
            const expectedActions = [{
                type: constants.UPDATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.UPDATE_CONTRACT_PRODUCT_SUCCESS,
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('dispatches right actions on updateContractProduct().onError', () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const error = new Error('test error')

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: (cb) => {
                    cb(error)
                    return cc
                },
            }
            sandbox.stub(services, 'updateContractProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.updateContractProduct(id, product))
            const expectedActions = [{
                type: constants.UPDATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.UPDATE_CONTRACT_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: error.message,
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
