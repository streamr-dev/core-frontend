import { normalize } from 'normalizr'
import {
    selectMyProductListIds,
    selectMyProductList,
    selectFetchingMyProductList,
    selectMyProductListError,
} from '$mp/modules/myProductList/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
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
const { result, entities } = normalize(products, productsSchema)
const myProductList = {
    ids: result,
    fetching: false,
    error: null,
}
const state: Partial<StoreState> = {
    entities,
    myProductList,
}
describe('myProductList - selectors', () => {
    it('selects myProductList product ids', () => {
        expect(selectMyProductListIds(state as StoreState)).toStrictEqual(myProductList.ids)
    })
    it('selects all myProductList products', () => {
        expect(selectMyProductList(state as StoreState)).toStrictEqual(products)
    })
    it('selects fetching status for myProductList', () => {
        expect(selectFetchingMyProductList(state as StoreState)).toStrictEqual(myProductList.fetching)
    })
    it('selects error', () => {
        expect(selectMyProductListError(state as StoreState)).toStrictEqual(myProductList.error)
    })
})
