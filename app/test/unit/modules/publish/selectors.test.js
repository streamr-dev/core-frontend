import assert from 'assert-diff'

import * as selectors from '../../../../src/marketplace/modules/publish/selectors'

describe('publish - selectors', () => {
    const publish = {
        transactionState: 'test transactionState',
        hash: 'test hash',
        isPublish: true,
        error: {
            message: 'error',
        },
    }

    const state = {
        publish,
    }

    it('selects transactionState', () => {
        assert.deepStrictEqual(selectors.selectTransactionState(state), publish.transactionState)
    })

    it('selects transactionHash', () => {
        assert.deepStrictEqual(selectors.selectTransactionHash(state), publish.hash)
    })

    it('selects publish/unpublish flag', () => {
        assert.deepStrictEqual(selectors.selectIsPublish(state), publish.isPublish)
    })

    it('selects error', () => {
        assert.deepStrictEqual(selectors.selectError(state), publish.error)
    })
})
