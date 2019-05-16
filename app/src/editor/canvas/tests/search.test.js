import { setupAuthorizationHeader } from '$editor/shared/tests/utils'

import * as State from '../state'
import * as Services from '../services'

describe('Canvas Module', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    let categories
    let fullList

    beforeAll(async () => {
        categories = await Services.getModuleCategories()
        fullList = State.moduleCategoriesIndex(categories)
    })

    test('empty search returns full list', () => {
        expect(State.moduleSearch(categories, '')).toEqual(fullList)
        expect(State.moduleSearch(categories, ' ')).toEqual(fullList)
        expect(State.moduleSearch(categories, '  ')).toEqual(fullList)
    })

    test('exact match displays first', () => {
        fullList.forEach(({ id, name }) => {
            const [firstResult] = State.moduleSearch(categories, name) || []
            expect(firstResult).toBeTruthy()
            expect(firstResult.id).toBe(id)
        })
    })

    test('names matches sort before path matches', () => {
        const search = 'Boolean'
        const results = State.moduleSearch(categories, search)
        const nameMatchesSearch = (name) => name.toLowerCase().includes(search.toLowerCase())
        // find first result that doesn't match on name
        const firstPathMatchIndex = results.findIndex(({ name }) => !nameMatchesSearch(name))
        // ensure we have at least some path-matching results
        expect(firstPathMatchIndex).toBeGreaterThan(0)
        expect(firstPathMatchIndex).toBeLessThan(results.length - 1)
        // every item that match
        results.forEach(({ name }, index) => {
            if (nameMatchesSearch(name)) {
                expect(index).toBeLessThan(firstPathMatchIndex)
            }
        })
    })

    test('names starting with search term match before names not starting with search term', () => {
        const search = 'Map'
        const results = State.moduleSearch(categories, search)
        const nameMatchesSearch = (name) => name.toLowerCase().startsWith(search.toLowerCase())
        // find first result that doesn't start with search
        const firstNotStartingWithSearchIndex = results.findIndex(({ name }) => !nameMatchesSearch(name))
        // ensure we have at least some results that don't start with search
        expect(firstNotStartingWithSearchIndex).toBeGreaterThan(0)
        expect(firstNotStartingWithSearchIndex).toBeLessThan(results.length - 1)
        // every item that match
        results.forEach(({ name }, index) => {
            if (nameMatchesSearch(name)) {
                expect(index).toBeLessThan(firstNotStartingWithSearchIndex)
            }
        })
    })
})
