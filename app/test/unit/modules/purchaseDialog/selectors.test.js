import assert from 'assert-diff'
import { normalize } from 'normalizr'

import { productsSchema } from '$shared/modules/entities/schema'
import * as all from '$mp/modules/deprecated/purchaseDialog/selectors'

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
const purchaseData = {
    time: '1',
    timeUnit: 'day',
}
const { result, entities } = normalize(products, productsSchema)

const state = {
    test: true,
    purchaseDialog: {
        step: 'TESTING_STEP',
        productId: '1338',
        data: purchaseData,
    },
    product: result,
    entities,
}

describe('purchaseDialog - selectors', () => {
    it('selects correct step', () => {
        assert.deepStrictEqual(all.selectStep(state), 'TESTING_STEP')
    })

    it('selects product', () => {
        assert.deepStrictEqual(all.selectProduct(state), products[1])
    })

    it('selects purchase data', () => {
        assert.deepStrictEqual(all.selectPurchaseData(state), purchaseData)
    })
})
