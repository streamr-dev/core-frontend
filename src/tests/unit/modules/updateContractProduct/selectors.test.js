import assert from 'assert-diff'

import * as selectors from '../../../../modules/updateContractProduct/selectors'

describe('updateContractProduct - selectors', () => {
    const updateContractProduct = {
        transactionState: 'test transactionState',
    }

    const state = {
        updateContractProduct,
    }

    it('selects transactionState', () => {
        assert.deepEqual(selectors.selectTransactionState(state), updateContractProduct.transactionState)
    })
})
