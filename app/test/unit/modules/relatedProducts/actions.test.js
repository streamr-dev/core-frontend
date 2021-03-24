import { normalize } from 'normalizr'

import * as actions from '$mp/modules/relatedProducts/actions'
import * as constants from '$mp/modules/relatedProducts/constants'
import * as entityConstants from '$shared/modules/entities/constants'
import * as services from '$mp/modules/relatedProducts/services'
import { productsSchema } from '$shared/modules/entities/schema'

import mockStore from '$testUtils/mockStoreProvider'

describe('relatedProducts - actions', () => {
    const productId = '123'
    const relatedProducts = [
        {
            id: '123456789',
            name: 'Product 1',
        },
        {
            id: '1011121314',
            name: 'Product 2',
        },
    ]

    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('gets related products', async () => {
        jest.spyOn(services, 'getRelatedProducts').mockImplementation(() => Promise.resolve(relatedProducts))
        const store = mockStore()
        await store.dispatch(actions.getRelatedProducts(productId))
        const { result, entities } = normalize(relatedProducts, productsSchema)

        const expectedActions = [
            {
                type: constants.GET_RELATED_PRODUCTS_REQUEST,
            },
            {
                type: entityConstants.UPDATE_ENTITIES,
                payload: {
                    entities,
                },
            },
            {
                type: constants.GET_RELATED_PRODUCTS_SUCCESS,
                payload: {
                    products: result,
                },
            },
        ]

        expect(store.getActions()).toStrictEqual(expectedActions)
    })

    it('responds to errors', async () => {
        const error = new Error('Error')
        jest.spyOn(services, 'getRelatedProducts').mockImplementation(() => Promise.reject(error))
        const store = mockStore()
        await store.dispatch(actions.getRelatedProducts(productId))

        const expectedActions = [
            {
                type: constants.GET_RELATED_PRODUCTS_REQUEST,
            },
            {
                type: constants.GET_RELATED_PRODUCTS_FAILURE,
                error: true,
                payload: error,
            },
        ]

        expect(store.getActions()).toStrictEqual(expectedActions)
    })
})
