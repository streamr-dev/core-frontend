import { normalize } from 'normalizr'
import * as all from '$mp/modules/categories/selectors'
import { categoriesSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
const categories = [
    {
        id: 1,
        name: 'Test 1',
    },
    {
        id: 2,
        name: 'Test 2',
    },
    {
        id: 3,
        name: 'Test 3',
    },
]
const normalized = normalize(categories, categoriesSchema)
const state: Partial<StoreState> = {
    categories: {
        ids: normalized.result,
        fetching: false,
        error: null,
    },
    entities: normalized.entities,
}
describe('categories - selectors', () => {
    it('selects category ids', () => {
        expect(all.selectCategoryIds(state as StoreState)).toStrictEqual(state.categories.ids)
    })
    it('selects all categories', () => {
        expect(all.selectAllCategories(state as StoreState)).toStrictEqual(categories)
    })
    it('selects fetching status for categories', () => {
        expect(all.selectFetchingCategories(state as StoreState)).toStrictEqual(false)
    })
    it('selects error', () => {
        expect(all.selectCategoriesError(state as StoreState)).toStrictEqual(null)
    })
})
