import { normalize } from 'normalizr'
import * as all from '$mp/modules/relatedProducts/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
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
const state: Partial<StoreState> = {
    relatedProducts: {
        ids: normalized.result,
        fetching: false,
        error: null,
    },
    entities: normalized.entities,
}
describe('relatedProducts - selectors', () => {
    it('selects related product ids', () => {
        expect(all.selectRelatedProductListIds(state as StoreState)).toStrictEqual(state.relatedProducts.ids)
    })
    it('selects all related products', () => {
        expect(all.selectRelatedProductList(state as StoreState)).toStrictEqual(relatedProducts)
    })
    it('selects fetching status for related products', () => {
        expect(all.selectFetchingRelatedProductList(state as StoreState)).toStrictEqual(false)
    })
    it('selects related products error', () => {
        expect(all.selectRelatedProductListError(state as StoreState)).toStrictEqual(null)
    })
})
