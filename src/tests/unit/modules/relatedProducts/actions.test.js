import assert from 'assert-diff'
import sinon from 'sinon'
import { normalize } from 'normalizr'

import * as actions from '../../../../modules/relatedProducts/actions'
import * as constants from '../../../../modules/relatedProducts/constants'
import * as entityConstants from '../../../../modules/entities/constants'
import * as services from '../../../../modules/relatedProducts/services'
import { productsSchema } from '../../../../modules/entities/schema'

import mockStore from '../../../test-utils/mockStoreProvider'

describe('relatedProducts - actions', () => {
    let sandbox
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
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('gets related products', async () => {
        sandbox.stub(services, 'getRelatedProducts').callsFake(() => Promise.resolve(relatedProducts))
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

        assert.deepEqual(store.getActions(), expectedActions)
    })

    it('responds to errors', async () => {
        sandbox.stub(services, 'getRelatedProducts').callsFake(() => Promise.reject(new Error('Error')))
        const store = mockStore()
        await store.dispatch(actions.getRelatedProducts(productId))

        const expectedActions = [
            {
                type: constants.GET_RELATED_PRODUCTS_REQUEST,
            },
            {
                type: constants.GET_RELATED_PRODUCTS_FAILURE,
                error: true,
                payload: {},
            },
        ]

        assert.deepEqual(store.getActions(), expectedActions)
    })
})
