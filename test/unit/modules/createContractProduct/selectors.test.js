import assert from 'assert-diff'

import * as selectors from '../../../../src/modules/createContractProduct/selectors'

describe('createContractProduct - selectors', () => {
    const createContractProduct = {
        transactionState: 'test transactionState',
        hash: 'test hash',
    }

    const state = {
        createContractProduct,
    }

    it('selects transactionState', () => {
        assert.deepStrictEqual(selectors.selectTransactionState(state), createContractProduct.transactionState)
    })

    it('selects transactionHash', () => {
        assert.deepStrictEqual(selectors.selectTransactionHash(state), createContractProduct.hash)
    })
})
