import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { normalize } from 'normalizr'

import sinon from 'sinon'
import * as actions from '$mp/modules/productList/actions'
import * as constants from '$mp/modules/productList/constants'
import * as entityConstants from '$shared/modules/entities/constants'
import * as services from '$mp/modules/productList/services'
import { productsSchema } from '$shared/modules/entities/schema'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

jest.mock('$mp/modules/productList/services')

describe('productList - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getProducts', () => {
        it('gets products succesfully', async () => {
            const products = [
                {
                    id: '123abc',
                    name: 'Test 1',
                },
                {
                    id: '456def',
                    name: 'Test 2',
                },
                {
                    id: '789ghi',
                    name: 'Test 3',
                },
            ]
            const { result, entities } = normalize(products, productsSchema)

            sandbox.stub(services, 'getProducts').callsFake(() => Promise.resolve({
                products,
                hasMoreProducts: false,
            }))

            const store = mockStore({
                productList: {
                    filter: '',
                },
            })
            await store.dispatch(actions.getProducts())

            const expectedActions = [
                {
                    type: constants.GET_PRODUCTS_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_PRODUCTS_SUCCESS,
                    payload: {
                        products: result,
                        hasMore: false,
                    },
                },
            ]
            const resultActions = store.getActions()
            expect(resultActions).toStrictEqual(expectedActions)
        })
    })
})
