import { normalize } from 'normalizr'

import {
    selectMyProductListIds,
    selectMyProductList,
    selectFetchingMyProductList,
    selectMyProductListError,
} from '$mp/modules/myProductList/selectors'
import { productsSchema } from '$shared/modules/entities/schema'

const products = [
    {
        id: '1337',
        name: 'Test 1',
        category: 'cat-1',
        pricePerSecond: 123,
        isFree: false,
    },
    {
        id: '1338',
        name: 'Test 2',
        category: 'cat-2',
        pricePerSecond: 0,
        isFree: true,
    },
]

const { result, entities } = normalize(products, productsSchema)

const myProductList = {
    ids: result,
    fetching: false,
    error: null,
}

const state = {
    test: true,
    entities,
    myProductList,
    otherData: 42,
}

describe('myProductList - selectors', () => {
    it('selects myProductList product ids', () => {
        expect(selectMyProductListIds(state)).toStrictEqual(myProductList.ids)
    })

    it('selects all myProductList products', () => {
        expect(selectMyProductList(state)).toStrictEqual(products)
    })

    it('selects fetching status for myProductList', () => {
        expect(selectFetchingMyProductList(state)).toStrictEqual(myProductList.fetching)
    })

    it('selects error', () => {
        expect(selectMyProductListError(state)).toStrictEqual(myProductList.error)
    })
})
