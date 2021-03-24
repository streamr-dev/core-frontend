import { normalize } from 'normalizr'

import * as all from '$mp/modules/categories/selectors'
import { categoriesSchema } from '$shared/modules/entities/schema'

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

const state = {
    test: true,
    categories: {
        ids: normalized.result,
        fetching: false,
        error: null,
    },
    otherData: 42,
    entities: normalized.entities,
}

describe('categories - selectors', () => {
    it('selects category ids', () => {
        expect(all.selectCategoryIds(state)).toStrictEqual(state.categories.ids)
    })

    it('selects all categories', () => {
        expect(all.selectAllCategories(state)).toStrictEqual(categories)
    })

    it('selects fetching status for categories', () => {
        expect(all.selectFetchingCategories(state)).toStrictEqual(false)
    })

    it('selects error', () => {
        expect(all.selectCategoriesError(state)).toStrictEqual(null)
    })
})
