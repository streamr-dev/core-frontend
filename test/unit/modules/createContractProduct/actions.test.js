import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../src/modules/createContractProduct/actions'
import * as constants from '../../../../src/modules/createContractProduct/constants'
import * as notificationActions from '../../../../src/modules/notifications/actions'
import * as publishActions from '../../../../src/modules/publish/actions'
import * as productActions from '../../../../src/modules/product/actions'
import * as services from '../../../../src/modules/createContractProduct/services'

// Only affects this test file
jest.setTimeout(6000)

describe('createContractProduct - actions', () => {
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

    describe('createContractProduct', () => {
        it('calls services.createContractProduct', () => {
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
            const ccStub = sandbox.stub(services, 'createContractProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.createContractProduct(id, product))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(product))
        })

        it('dispatches right actions on createContractProduct().onTransactionHash', () => {
            sandbox.stub(notificationActions, 'showTransactionNotification').callsFake((hash) => ({
                type: 'showTransactionNotification',
                hash,
            }))
            sandbox.stub(publishActions, 'setProductDeploying').callsFake((id, hash) => ({
                type: 'setProductDeploying',
                id,
                hash,
            }))

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
            sandbox.stub(services, 'createContractProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.createContractProduct(id, product))
            const expectedActions = [{
                type: constants.CREATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    product,
                },
            }, {
                type: constants.RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
                payload: {
                    hash,
                },
            }, {
                type: 'showTransactionNotification',
                hash,
            }, {
                type: 'setProductDeploying',
                id,
                hash,
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on createContractProduct().onTransactionComplete', (done) => {
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

            sandbox.stub(productActions, 'getProductById').callsFake((idToGet) => ({
                type: 'getProductById',
                id: idToGet,
            }))

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: (cb) => {
                    cb(receipt)
                    return cc
                },
                onError: () => cc,
            }
            sandbox.stub(services, 'createContractProduct').callsFake(() => cc)
            // Couldn't mock react-router-redux's getLocation for some reason so let's use the real one
            const store = mockStore({
                router: {
                    location: {
                        pathname: `/product/${id}`,
                    },
                },
            })
            store.dispatch(actions.createContractProduct(id, product))
            const expectedActions = [{
                type: constants.CREATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    product,
                },
            }, {
                type: constants.CREATE_CONTRACT_PRODUCT_SUCCESS,
                payload: {
                    receipt,
                },
            }, {
                type: 'getProductById',
                id: 'test',
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('doesnt dispatch getProductById if not on product page', (done) => {
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

            sandbox.stub(productActions, 'getProductById').callsFake((idToGet) => ({
                type: 'getProductById',
                id: idToGet,
            }))

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: (cb) => {
                    cb(receipt)
                    return cc
                },
                onError: () => cc,
            }
            sandbox.stub(services, 'createContractProduct').callsFake(() => cc)
            // Couldn't mock react-router-redux's getLocation for some reason so let's use the real one
            const store = mockStore({
                router: {
                    location: {
                        pathname: '/product/notProperId',
                    },
                },
            })
            store.dispatch(actions.createContractProduct(id, product))
            const expectedActions = [{
                type: constants.CREATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    product,
                },
            }, {
                type: constants.CREATE_CONTRACT_PRODUCT_SUCCESS,
                payload: {
                    receipt,
                },
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('dispatches right actions on createContractProduct().onError', () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const error = new Error('test error')
            sandbox.stub(productActions, 'getProductById').callsFake((idToGet) => ({
                type: 'getProductById',
                id: idToGet,
            }))

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: (cb) => {
                    cb(error)
                    return cc
                },
            }
            sandbox.stub(services, 'createContractProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.createContractProduct(id, product))
            const expectedActions = [{
                type: constants.CREATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    product,
                },
            }, {
                type: constants.CREATE_CONTRACT_PRODUCT_FAILURE,
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
