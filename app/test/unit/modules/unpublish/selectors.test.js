import assert from 'assert-diff'

import * as selectors from '$mp/modules/unpublish/selectors'

describe('unpublish - selectors', () => {
    const unpublish = {
        productId: 'product',
        publishingContract: true,
        contractTx: 'test',
        contractError: {
            message: 'error',
        },
        publishingFree: true,
        freeProductState: 'pending',
        freeProductError: {
            message: 'error',
        },
        setDeploying: false,
        setDeployingError: null,
    }
    const testTransaction = {
        id: 'test',
        type: 'unpublish',
        state: 'started',
    }
    const entities = {
        transactions: {
            test: testTransaction,
        },
    }
    const state = {
        unpublish,
        entities,
    }

    it('selects contract transaction', () => {
        assert.deepStrictEqual(selectors.selectContractTransaction(state), testTransaction)
    })

    it('select contract transaction error', () => {
        assert.deepStrictEqual(selectors.selectContractError(state), state.unpublish.contractError)
    })

    it('selects free product unpublish state', () => {
        assert.deepStrictEqual(selectors.selectFreeProductState(state), state.unpublish.freeProductState)
    })

    it('selects free product unpublish error', () => {
        assert.deepStrictEqual(selectors.selectFreeProductError(state), state.unpublish.freeProductError)
    })
})
