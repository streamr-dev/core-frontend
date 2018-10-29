import assert from 'assert-diff'

import * as selectors from '$mp/modules/updateContractProduct/selectors'

describe('updateContractProduct - selectors', () => {
    const updateContractProduct = {
        transactionState: 'test transactionState',
        modifyTx: 'test',
    }
    const entities = {
        transactions: {
            test: {
                id: 'test',
                type: 'updateContractProduct',
                status: 'pending',
            },
        },
    }

    const state = {
        updateContractProduct,
        entities,
    }

    it('selects the contract transaction', () => {
        assert.deepStrictEqual(selectors.selectUpdateProductTransaction(state), entities.transactions.test)
    })

    it('selects the transaction error', () => {
        assert.deepStrictEqual(selectors.selectUpdateContractProductError(state), updateContractProduct.error)
    })
})
