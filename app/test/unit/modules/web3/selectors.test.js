import assert from 'assert-diff'

import * as all from '../../../../src/marketplace/modules/web3/selectors'

const state = {
    test: true,
    web3: {
        accountId: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
        error: null,
        enabled: true,
    },
    otherData: 42,
    entities: {},
}

describe('web3 - selectors', () => {
    it('selects account id', () => {
        assert.deepStrictEqual(all.selectAccountId(state), state.web3.accountId)
    })

    it('selects enabled', () => {
        assert.deepStrictEqual(all.selectEnabled(state), true)
    })

    it('selects error', () => {
        assert.deepStrictEqual(all.selectAccountError(state), null)
    })
})
