import assert from 'assert-diff'

import * as selectors from '$mp/modules/publish/selectors'

describe('publish - selectors', () => {
    const publish = {
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
        type: 'publish',
        state: 'started',
    }
    const entities = {
        transactions: {
            test: testTransaction,
        },
    }
    const state = {
        publish,
        entities,
    }

    it('selects contract transaction', () => {
        assert.deepStrictEqual(selectors.selectContractTransaction(state), testTransaction)
    })

    it('select contract transaction error', () => {
        assert.deepStrictEqual(selectors.selectContractError(state), state.publish.contractError)
    })

    it('selects free product publish state', () => {
        assert.deepStrictEqual(selectors.selectFreeProductState(state), state.publish.freeProductState)
    })

    it('selects free product publish error', () => {
        assert.deepStrictEqual(selectors.selectFreeProductError(state), state.publish.freeProductError)
    })
})
