import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '$mp/modules/deprecated/publishDialog/selectors'
import { productsSchema } from '$shared/modules/entities/schema'

const products = [{
    id: '1337',
    name: 'Test 1',
    category: 'cat-1',
    pricePerSecond: 123,
    isFree: false,
}, {
    id: '1338',
    name: 'Test 2',
    category: 'cat-2',
    pricePerSecond: 0,
    isFree: true,
}]
const { entities } = normalize(products, productsSchema)

const state = {
    test: true,
    publishDialog: {
        step: 'test step',
        productId: '1338',
    },
    entities,
}

describe('publishDialog - selectors', () => {
    it('selects step', () => {
        assert.equal(all.selectStep(state), 'test step')
    })
    it('selects product', () => {
        assert.deepStrictEqual(all.selectProduct(state), products[1])
    })
})
