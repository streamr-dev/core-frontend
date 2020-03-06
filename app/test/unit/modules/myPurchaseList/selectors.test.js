import assert from 'assert-diff'
import { normalize } from 'normalizr'
import merge from 'lodash/merge'

import * as all from '$mp/modules/myPurchaseList/selectors'
import { productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'

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

const normalizedProducts = normalize(products, productsSchema)

const subscriptions = [
    {
        id: products[0].id,
        user: 'test-user-1',
        endsAt: '2010-10-10T10:10:10Z',
        product: products[0],
    },
    {
        id: products[1].id,
        user: 'test-user-1',
        endsAt: '2010-11-10T10:10:10Z',
        product: products[1],
    },
    {
        id: products[2].id,
        user: 'test-user-1',
        endsAt: '2010-12-10T10:10:10Z',
        product: products[2],
    },
]

const normalizedSubscriptions = normalize(subscriptions, subscriptionsSchema)

const state = {
    test: true,
    myPurchaseList: {
        fetching: false,
        error: null,
        products: normalizedProducts.result,
        subscriptions: normalizedProducts.result,
    },
    entities: merge(
        normalizedProducts.entities,
        normalizedSubscriptions.entities,
    ),
}

describe('myPurchaseList - selectors', () => {
    it('selects fetching status for my purchases', () => {
        assert.deepStrictEqual(all.selectFetchingMyPurchaseList(state), false)
    })

    it('selects my purchase list ids', () => {
        assert.deepStrictEqual(all.selectMyPurchaseListIds(state), state.myPurchaseList.products)
    })

    it('selects purchase list', () => {
        assert.deepStrictEqual(all.selectMyPurchaseList(state), products)
    })

    it('selects error', () => {
        assert.deepStrictEqual(all.selectMyPurchaseListError(state), null)
    })

    it('selects subscriptions', () => {
        assert.deepStrictEqual(all.selectSubscriptions(state), subscriptions)
    })
})
