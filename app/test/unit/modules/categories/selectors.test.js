import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '../../../../src/marketplace/modules/categories/selectors'
import { categoriesSchema } from '../../../../src/marketplace/modules/entities/schema'

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
        assert.deepStrictEqual(all.selectCategoryIds(state), state.categories.ids)
    })

    it('selects all categories', () => {
        assert.deepStrictEqual(all.selectAllCategories(state), categories)
    })

    it('selects fetching status for categories', () => {
        assert.deepStrictEqual(all.selectFetchingCategories(state), false)
    })

    it('selects error', () => {
        assert.deepStrictEqual(all.selectCategoriesError(state), null)
    })
})
