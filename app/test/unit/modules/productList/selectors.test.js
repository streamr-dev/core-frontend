import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '../../../../src/marketplace/modules/productList/selectors'
import { productsSchema } from '../../../../src/marketplace/modules/entities/schema'

import { initialState } from '../../../../src/marketplace/modules/productList/reducer'
import { productListPageSize } from '../../../../src/marketplace/utils/constants'

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
        assert.deepStrictEqual(all.selectFetchingProductList(state), false)
    })

    it('selects product list ids', () => {
        assert.deepStrictEqual(all.selectProductListIds(state), state.productList.ids)
    })

    it('selects product list', () => {
        assert.deepStrictEqual(all.selectProductList(state), products)
    })

    it('selects filter', () => {
        assert.deepStrictEqual(all.selectFilter(state), state.productList.filter)
    })

    it('selects error', () => {
        assert.deepStrictEqual(all.selectProductListError(state), null)
    })

    it('selects page size', () => {
        assert.deepStrictEqual(all.selectPageSize(state), productListPageSize)
    })

    it('selects offset', () => {
        assert.deepStrictEqual(all.selectOffset(state), state.productList.offset)
    })

    it('selects has more results', () => {
        assert.deepStrictEqual(all.selectHasMoreSearchResults(state), false)
    })
})
