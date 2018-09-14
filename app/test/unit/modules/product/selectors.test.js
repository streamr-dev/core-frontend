import assert from 'assert-diff'
import { normalize } from 'normalizr'
import merge from 'lodash/merge'

import * as all from '../../../../src/modules/product/selectors'
import { categoriesSchema, streamsSchema, productsSchema, subscriptionsSchema } from '../../../../src/modules/entities/schema'

const categories = [
    {
        id: 'cat-1',
        name: 'Test 1',
    },
    {
        id: 'cat-2',
        name: 'Test 2',
    },
]
const normalizedCategories = normalize(categories, categoriesSchema)

const streams = [
    {
        id: 1,
        name: 'Test 1',
    },
    {
        id: 2,
        name: 'Test 2',
    },
]
const normalizedStreams = normalize(streams, streamsSchema)

const products = [
    {
        id: '1337',
        name: 'Test 1',
        category: 'cat-1',
        pricePerSecond: 123,
        isFree: false,
    },
    {
        id: '1338',
        name: 'Test 2',
        category: 'cat-2',
        pricePerSecond: 0,
        isFree: true,
    },
]
const normalizedProducts = normalize(products, productsSchema)

const subscriptions = [
    {
        address: '0x123',
        endsAt: Date.now() + 100000,
        product: products[0],
    },
    {
        address: '0x1263e6',
        endsAt: 0,
        product: products[1],
    },
]
const normalizedSubscriptions = normalize(subscriptions, subscriptionsSchema)

const state = {
    test: true,
    product: {
        id: '1337',
        fetchingProduct: true,
        productError: null,
        streams: normalizedStreams.result,
        fetchingStreams: true,
        streamsError: null,
        fetchingContractSubscription: true,
        contractSubscriptionError: null,
        contractSubscription: {
            id: '1337',
        },
    },
    myPurchaseList: {
        ids: ['1337', '1338'],
    },
    otherData: 42,
    entities: merge(
        normalizedProducts.entities,
        normalizedCategories.entities,
        normalizedStreams.entities,
        normalizedSubscriptions.entities,
    ),
}

describe('product - selectors', () => {
    it('selects product fetching status', () => {
        assert.equal(all.selectFetchingProduct(state), true)
    })

    it('selects product id', () => {
        assert.equal(all.selectProductId(state), '1337')
    })

    it('selects product', () => {
        assert.deepStrictEqual(all.selectProduct(state), products[0])
    })

    it('selects product error', () => {
        assert.equal(all.selectProductError(state), null)
    })

    it('selects product streams', () => {
        assert.equal(all.selectFetchingStreams(state), true)
    })

    it('selects product stream ids', () => {
        assert.deepStrictEqual(all.selectStreamIds(state), [1, 2])
    })

    it('selects product streams', () => {
        assert.deepStrictEqual(all.selectStreams(state), streams)
    })

    it('selects category', () => {
        assert.deepStrictEqual(all.selectCategory(state), categories[0])
    })

    it('selects streams error', () => {
        assert.equal(all.selectStreamsError(state), null)
    })

    it('selects contract subscription', () => {
        assert.equal(all.selectContractSubscription(state), state.product.contractSubscription)
    })

    it('selects contract subscription validity status', () => {
        assert.equal(all.selectContractSubscriptionIsValid(state), false)
    })

    it('selects product free status', () => {
        assert.equal(all.selectProductIsFree(state), false)
    })

    it('selects product purchased status', () => {
        assert.equal(all.selectProductIsPurchased(state), true)
    })

    it('selects subscription validity status', () => {
        assert.equal(all.selectSubscriptionIsValid(state), true)
    })
})
