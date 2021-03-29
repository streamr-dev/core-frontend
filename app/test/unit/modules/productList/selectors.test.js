import { normalize } from 'normalizr'

import * as all from '$mp/modules/productList/selectors'
import { productsSchema } from '$shared/modules/entities/schema'

import { initialState } from '$mp/modules/productList/reducer'
import { productListPageSize } from '$mp/utils/constants'

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

const state = {
    test: true,
    productList: {
        ...initialState,
        ids: normalized.result,
    },
    entities: normalized.entities,
}

describe('productList - selectors', () => {
    it('selects fetching product list status', () => {
        expect(all.selectFetchingProductList(state)).toStrictEqual(false)
    })

    it('selects product list ids', () => {
        expect(all.selectProductListIds(state)).toStrictEqual(state.productList.ids)
    })

    it('selects product list', () => {
        expect(all.selectProductList(state)).toStrictEqual(products)
    })

    it('selects filter', () => {
        expect(all.selectFilter(state)).toStrictEqual(state.productList.filter)
    })

    it('selects error', () => {
        expect(all.selectProductListError(state)).toStrictEqual(undefined)
    })

    it('selects page size', () => {
        expect(all.selectPageSize(state)).toStrictEqual(productListPageSize)
    })

    it('selects offset', () => {
        expect(all.selectOffset(state)).toStrictEqual(state.productList.offset)
    })

    it('selects has more results', () => {
        expect(all.selectHasMoreSearchResults(state)).toStrictEqual(false)
    })
})
