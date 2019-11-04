import assert from 'assert-diff'
import { normalize } from 'normalizr'

import reducer, { initialState } from '$shared/modules/entities/reducer'
import * as constants from '$shared/modules/entities/constants'
import * as schemas from '$shared/modules/entities/schema'

describe('entities - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles entities', () => {
        const categories = [
            {
                id: 1,
                name: 'Category 1',
            },
            {
                id: 2,
                name: 'Category 2',
            },
        ]
        const products = [
            {
                id: '123456789',
                title: 'Product 1',
            },
            {
                id: '1011121314',
                title: 'Product 2',
            },
        ]
        const { entities: categoryEntities } = normalize(categories, schemas.categoriesSchema)
        const { entities: productEntities } = normalize(products, schemas.productsSchema)

        const expectedState = {
            categories: categories.reduce((result, value) => ({
                ...result,
                [value.id]: value,
            }), {}),
            products: products.reduce((result, value) => ({
                ...result,
                [value.id]: value,
            }), {}),
            contractProducts: {},
            communityProducts: {},
            streams: {},
            relatedProducts: {},
            subscriptions: {},
            transactions: {},
            dashboards: {},
            canvases: {},
            integrationKeys: {},
            resourceKeys: {},
        }

        let state = reducer(undefined, {
            type: constants.UPDATE_ENTITIES,
            payload: {
                entities: categoryEntities,
            },
        })
        state = reducer(state, {
            type: constants.UPDATE_ENTITIES,
            payload: {
                entities: productEntities,
            },
        })

        assert.deepStrictEqual(state, expectedState)
    })

    it('handles subscriptions', () => {
        const products = [
            {
                id: '123456789',
                title: 'Product 1',
            },
            {
                id: '1011121314',
                title: 'Product 2',
            },
        ]
        const subscriptions = [
            {
                endsAt: Date(),
                product: {
                    ...products[0],
                },
            },
            {
                endsAt: Date(),
                product: {
                    ...products[1],
                },
            },
        ]

        const { entities } = normalize(subscriptions, schemas.subscriptionsSchema)

        const expectedState = {
            categories: {},
            products: products.reduce((result, value) => ({
                ...result,
                [value.id]: value,
            }), {}),
            contractProducts: {},
            communityProducts: {},
            streams: {},
            relatedProducts: {},
            transactions: {},
            subscriptions: subscriptions.reduce((result, value) => ({
                ...result,
                [value.product.id]: {
                    endsAt: value.endsAt,
                    product: value.product.id,
                },
            }), {}),
            dashboards: {},
            canvases: {},
            integrationKeys: {},
            resourceKeys: {},
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.UPDATE_ENTITIES,
            payload: {
                entities,
            },
        }), expectedState)
    })
})
