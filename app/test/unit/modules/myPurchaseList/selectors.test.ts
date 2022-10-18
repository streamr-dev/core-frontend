import { normalize } from 'normalizr'
import merge from 'lodash/merge'
import * as all from '$mp/modules/myPurchaseList/selectors'
import { productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
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
const state: Partial<StoreState> = {
    myPurchaseList: {
        fetching: false,
        error: null,
        products: normalizedProducts.result,
        subscriptions: normalizedProducts.result,
        filter: null
    },
    entities: merge(normalizedProducts.entities, normalizedSubscriptions.entities),
}
describe('myPurchaseList - selectors', () => {
    it('selects fetching status for my purchases', () => {
        expect(all.selectFetchingMyPurchaseList(state as StoreState)).toStrictEqual(false)
    })
    it('selects my purchase list ids', () => {
        expect(all.selectMyPurchaseListIds(state as StoreState)).toStrictEqual(state.myPurchaseList.products)
    })
    it('selects purchase list', () => {
        expect(all.selectMyPurchaseList(state as StoreState)).toStrictEqual(products)
    })
    it('selects error', () => {
        expect(all.selectMyPurchaseListError(state as StoreState)).toStrictEqual(null)
    })
    it('selects subscriptions', () => {
        expect(all.selectSubscriptions(state as StoreState)).toStrictEqual(subscriptions)
    })
})
