import assert from 'assert-diff'

import * as selectors from '$mp/modules/createContractProduct/selectors'

describe('createContractProduct - selectors', () => {
    const createContractProduct = {
        transactionState: 'test transactionState',
        modifyTx: 'test',
    }
    const entities = {
        transactions: {
            test: {
                id: 'test',
                type: 'createContractProduct',
                status: 'pending',
            },
        },
    }

    const state = {
        createContractProduct,
        entities,
    }

    it('selects the contract transaction', () => {
        assert.deepStrictEqual(selectors.selectCreateContractProductTransaction(state), entities.transactions.test)
    })

    it('selects the transaction error', () => {
        assert.deepStrictEqual(selectors.selectCreateContractProductError(state), createContractProduct.error)
    })
})
