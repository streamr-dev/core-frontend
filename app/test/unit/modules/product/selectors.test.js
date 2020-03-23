import assert from 'assert-diff'
import { normalize } from 'normalizr'
import merge from 'lodash/merge'

import * as all from '$mp/modules/product/selectors'
import { categoriesSchema, streamsSchema, productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'

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
        ownerAddress: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
    },
    {
        id: '1339',
        isFree: false,
        pricePerSecond: 200000000,
        ownerAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
    },
]
const normalizedProducts = normalize(products, productsSchema)

const subscriptions = [
    {
        id: '1337',
        address: '0x123',
        endsAt: Date.now() + 100000,
        product: products[0],
    },
    {
        id: '1338',
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
        productPermissions: {
            read: true,
            write: true,
            share: true,
            fetchingPermissions: false,
            permissionsError: null,
        },
    },
    myPurchaseList: {
        products: ['1337', '1338'],
        subscriptions: ['1337', '1338'],
    },
    otherData: 42,
    entities: merge(
        normalizedProducts.entities,
        normalizedCategories.entities,
        normalizedStreams.entities,
        normalizedSubscriptions.entities,
    ),
    web3: {
        accountId: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
        enabled: true,
    },
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

    it('selects permission fetching status', () => {
        assert.deepStrictEqual(all.selectFetchingProductSharePermission(state), false)
    })

    it('selects share permission', () => {
        assert.deepStrictEqual(all.selectProductSharePermission(state), true)
    })

    it('selects edit permission', () => {
        assert.deepStrictEqual(all.selectProductEditPermission(state), true)
    })

    it('selects publish permission when product is free', () => {
        const nextState = {
            ...state,
            product: {
                ...state.product,
                id: '1338',
            },
        }

        assert.deepStrictEqual(all.selectProductPublishPermission(nextState), true)
    })

    it('selects publish permission when product is paid and owned', () => {
        const nextState = {
            ...state,
            product: {
                ...state.product,
                id: '1338',
            },
        }

        assert.deepStrictEqual(all.selectProductPublishPermission(nextState), true)
    })

    it('selects publish permission when product is paid, owned and owner address matches despite capital letters', () => {
        const nextState = {
            ...state,
            web3: {
                accountId: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
            },
            product: {
                ...state.product,
                id: '1338',
            },
        }

        assert.deepStrictEqual(all.selectProductPublishPermission(nextState), true)
    })

    it('selects publish permission when product is paid and not owned', () => {
        const nextState = {
            ...state,
            product: {
                ...state.product,
                id: '1339',
            },
        }

        assert.deepStrictEqual(all.selectProductPublishPermission(nextState), false)
    })
})
