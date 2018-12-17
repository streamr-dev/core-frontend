import assert from 'assert-diff'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { normalize } from 'normalizr'

import sinon from 'sinon'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import * as constants from '$mp/modules/myProductList/constants'
import * as entityConstants from '$shared/modules/entities/constants'
import * as services from '$mp/modules/myProductList/services'
import { productsSchema } from '$shared/modules/entities/schema'

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

            const store = mockStore({
                myProductList: {
                    filter: null,
                },
            })

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
