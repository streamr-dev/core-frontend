import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '../../../../src/marketplace/modules/relatedProducts/selectors'
import { productsSchema } from '../../../../src/marketplace/modules/entities/schema'

const relatedProducts = [
    {
        id: '123456789',
        name: 'Product 1',
    },
    {
        id: '1011121314',
        name: 'Product 2',
    },
]

const normalized = normalize(relatedProducts, productsSchema)

const state = {
    test: true,
    relatedProducts: {
        ids: normalized.result,
        fetching: false,
        error: null,
    },
    otherData: 42,
    entities: normalized.entities,
}

describe('relatedProducts - selectors', () => {
    it('selects related product ids', () => {
        assert.deepStrictEqual(all.selectRelatedProductListIds(state), state.relatedProducts.ids)
    })

    it('selects all related products', () => {
        assert.deepStrictEqual(all.selectRelatedProductList(state), relatedProducts)
    })

    it('selects fetching status for related products', () => {
        assert.deepStrictEqual(all.selectFetchingRelatedProductList(state), false)
    })

    it('selects related products error', () => {
        assert.deepStrictEqual(all.selectRelatedProductListError(state), null)
    })
})
