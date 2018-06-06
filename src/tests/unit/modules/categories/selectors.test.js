import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '../../../../modules/categories/selectors'
import { categoriesSchema } from '../../../../modules/entities/schema'

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
        assert.deepEqual(all.selectCategoryIds(state), state.categories.ids)
    })

    it('selects all categories', () => {
        assert.deepEqual(all.selectAllCategories(state), categories)
    })

    it('selects fetching status for categories', () => {
        assert.deepEqual(all.selectFetchingCategories(state), false)
    })

    it('selects error', () => {
        assert.deepEqual(all.selectCategoriesError(state), null)
    })
})
