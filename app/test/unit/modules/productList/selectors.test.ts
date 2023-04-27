import { normalize } from 'normalizr'
import * as all from '$mp/modules/productList/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import { initialState } from '$mp/modules/productList/reducer'
import { productListPageSize } from '$mp/utils/constants'
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
const normalized = normalize(products, productsSchema)
const state: Partial<StoreState> = {
    productList: { ...initialState, ids: normalized.result },
    entities: normalized.entities,
}
describe('productList - selectors', () => {
    it('selects fetching product list status', () => {
        expect(all.selectFetchingProductList(state as StoreState)).toStrictEqual(false)
    })
    it('selects product list ids', () => {
        expect(all.selectProductListIds(state as StoreState)).toStrictEqual(state.productList.ids)
    })
    it('selects product list', () => {
        expect(all.selectProductList(state as StoreState)).toStrictEqual(products)
    })
    it('selects filter', () => {
        expect(all.selectFilter(state as StoreState)).toStrictEqual(state.productList.filter)
    })
    it('selects error', () => {
        expect(all.selectProductListError(state as StoreState)).toStrictEqual(undefined)
    })
    it('selects page size', () => {
        expect(all.selectPageSize(state as StoreState)).toStrictEqual(productListPageSize)
    })
    it('selects offset', () => {
        expect(all.selectOffset(state as StoreState)).toStrictEqual(state.productList.offset)
    })
    it('selects has more results', () => {
        expect(all.selectHasMoreSearchResults(state as StoreState)).toStrictEqual(false)
    })
    it('selects projectAuthor', () => {
        expect(all.selectProjectsAuthorFilter(state as StoreState)).toStrictEqual('all')
    })
})
