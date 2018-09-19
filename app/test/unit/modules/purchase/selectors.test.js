import assert from 'assert-diff'

import * as selectors from '../../../../src/marketplace/modules/purchase/selectors'

describe('purchase - selectors', () => {
    const purchase = {
        processing: true,
        purchaseTx: 'test',
        error: {
            message: 'error',
        },
    }
    const entities = {
        transactions: {
            test: {
                id: 'test',
                type: 'purchase',
                status: 'pending',
            },
        },
    }

    const state = {
        purchase,
        entities,
    }

    it('selects purchases started flag', () => {
        assert.deepStrictEqual(selectors.selectPurchaseStarted(state), true)
    })

    it('selects transaction Hash', () => {
        assert.deepStrictEqual(selectors.selectPurchaseTx(state), purchase.purchaseTx)
    })

    it('selects the purchase transaction', () => {
        assert.deepStrictEqual(selectors.selectPurchaseTransaction(state), entities.transactions.test)
    })
})
