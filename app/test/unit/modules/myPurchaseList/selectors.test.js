import assert from 'assert-diff'
import { normalize } from 'normalizr'
import merge from 'lodash/merge'

import * as all from '../../../../src/marketplace/modules/myPurchaseList/selectors'
import { productsSchema, subscriptionsSchema } from '../../../../src/marketplace/modules/entities/schema'

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
        user: 'test-user-1',
        endsAt: '2010-10-10T10:10:10Z',
        product: products[0],
    },
    {
        user: 'test-user-1',
        endsAt: '2010-11-10T10:10:10Z',
        product: products[1],
    },
    {
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
        ids: normalizedProducts.result,
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
        assert.deepStrictEqual(all.selectMyPurchaseListIds(state), state.myPurchaseList.ids)
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
