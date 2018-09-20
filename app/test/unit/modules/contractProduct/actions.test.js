import assert from 'assert-diff'
import { normalize } from 'normalizr'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../src/marketplace/modules/contractProduct/actions'
import * as constants from '../../../../src/marketplace/modules/contractProduct/constants'
import * as entityConstants from '../../../../src/marketplace/modules/entities/constants'
import * as services from '../../../../src/marketplace/modules/contractProduct/services'
import { contractProductSchema } from '../../../../src/marketplace/modules/entities/schema'

describe('contractProduct - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getProductFromContract', () => {
        it('gets contractProduct successfully', async () => {
            const store = mockStore()

            const product = {
                id: 'test',
                name: 'testName',
                description: 'testDescription',
            }
            const { result, entities } = normalize(product, contractProductSchema)

            sandbox.stub(services, 'getProductFromContract').callsFake((id) => Promise.resolve({
                ...product,
                id,
            }))

            await store.dispatch(actions.getProductFromContract('test'))
            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: result,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_SUCCESS,
                    payload: {
                        id: result,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const store = mockStore()

            sandbox.stub(services, 'getProductFromContract').callsFake(() => Promise.reject(new Error('test error')))
            const product = {
                id: 'test',
            }
            const { result } = normalize(product, contractProductSchema)

            await store.dispatch(actions.getProductFromContract('test'))

            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: result,
                    },
                },
                {
                    type: constants.GET_PRODUCT_FROM_CONTRACT_FAILURE,
                    payload: {
                        id: 'test',
                        error: {
                            message: 'test error',
                        },
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('clearContractProduct', () => {
        it('clears state', async () => {
            const store = mockStore()

            await store.dispatch(actions.clearContractProduct())
            const expectedActions = [
                {
                    type: constants.CLEAR_CONTRACT_PRODUCT,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
