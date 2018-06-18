import assert from 'assert-diff'

import * as selectors from '../../../../src/modules/updateContractProduct/selectors'

describe('updateContractProduct - selectors', () => {
    const updateContractProduct = {
        transactionState: 'test transactionState',
    }

    const state = {
        updateContractProduct,
    }

    it('selects transactionState', () => {
        assert.deepStrictEqual(selectors.selectTransactionState(state), updateContractProduct.transactionState)
    })
})
