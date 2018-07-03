import assert from 'assert-diff'

import * as selectors from '../../../../src/modules/purchase/selectors'

describe('purchase - selectors', () => {
    const purchase = {
        transactionState: 'test transactionState',
        hash: 'test hash',
    }

    const state = {
        purchase,
    }

    it('selects transactionState', () => {
        assert.deepStrictEqual(selectors.selectTransactionState(state), purchase.transactionState)
    })

    it('selects transactionHash', () => {
        assert.deepStrictEqual(selectors.selectTransactionHash(state), purchase.hash)
    })
})
