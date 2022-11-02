import { normalize } from 'normalizr'
import merge from 'lodash/merge'
import * as all from '$mp/modules/product/selectors'
import { categoriesSchema, streamsSchema, productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
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
const state: Partial<StoreState> = {
    product: {
        fetchingContractSubscription: true,
        contractSubscriptionError: null,
        contractSubscription: {
            productId: '1337',
            endTimestamp: new Date().getTime()
        },
    },
    myPurchaseList: {
        fetching: false,
        error:null,
        filter: null,
        products: ['1337', '1338'],
        subscriptions: ['1337', '1338'],
    },
    entities: merge(
        normalizedProducts.entities,
        normalizedCategories.entities,
        normalizedStreams.entities,
        normalizedSubscriptions.entities,
    ),
    web3: {
        error: null,
        ethereumNetworkId: '1234',
        accountId: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
        enabled: true,
    },
}
describe('product - selectors', () => {
    it('selects contract subscription', () => {
        expect(all.selectContractSubscription(state as StoreState)).toBe(state.product.contractSubscription)
    })
})
