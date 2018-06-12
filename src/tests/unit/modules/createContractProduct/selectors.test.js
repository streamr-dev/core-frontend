import assert from 'assert-diff'

import * as selectors from '../../../../modules/createContractProduct/selectors'

describe('createContractProduct - selectors', () => {
    const createContractProduct = {
        transactionState: 'test transactionState',
        hash: 'test hash',
    }

    const state = {
        createContractProduct,
    }

    it('selects transactionState', () => {
        assert.deepEqual(selectors.selectTransactionState(state), createContractProduct.transactionState)
    })

    it('selects transactionHash', () => {
        assert.deepEqual(selectors.selectTransactionHash(state), createContractProduct.hash)
    })
})
