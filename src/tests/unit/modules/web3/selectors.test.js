import assert from 'assert-diff'

import * as all from '../../../../modules/web3/selectors'

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
        assert.deepEqual(all.selectAccountId(state), state.web3.accountId)
    })

    it('selects enabled', () => {
        assert.deepEqual(all.selectEnabled(state), true)
    })

    it('selects error', () => {
        assert.deepEqual(all.selectAccountError(state), null)
    })
})
