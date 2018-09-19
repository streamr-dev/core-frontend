import assert from 'assert-diff'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { normalize } from 'normalizr'

import sinon from 'sinon'
import { getMyProducts } from '../../../../src/modules/myProductList/actions'
import * as constants from '../../../../src/modules/myProductList/constants'
import * as entityConstants from '../../../../src/modules/entities/constants'
import * as services from '../../../../src/modules/myProductList/services'
import { productsSchema } from '../../../../src/modules/entities/schema'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('myProductList - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getMyProducts', () => {
        it('gets myProducts succesfully', async () => {
            const products = [
                {
                    id: 'abc',
                    name: 'Test 1',
                },
                {
                    id: 'def',
                    name: 'Test 2',
                },
                {
                    id: 'ghi',
                    name: 'Test 3',
                },
            ]
            const { result, entities } = normalize(products, productsSchema)

            sandbox.stub(services, 'getMyProducts').callsFake(() => Promise.resolve(products))

            const store = mockStore()

            await store.dispatch(getMyProducts())

            const expectedActions = [
                {
                    type: constants.GET_MY_PRODUCTS_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_MY_PRODUCTS_SUCCESS,
                    payload: {
                        products: result,
                    },
                },
            ]
            const resultActions = store.getActions()
            assert.deepStrictEqual(resultActions, expectedActions)
        })
    })
})
