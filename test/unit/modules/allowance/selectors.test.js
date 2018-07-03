import assert from 'assert-diff'
import BN from 'bignumber.js'

import * as all from '../../../../src/modules/allowance/selectors'

const state = {
    test: true,
    allowance: {
        hash: 'hash',
        allowance: BN(5),
        pendingAllowance: BN(10),
        gettingAllowance: false,
        settingAllowance: true,
        receipt: 'test',
        error: null,
        transactionState: null,
    },
    otherData: 42,
    entities: {},
}

describe('allowance - selectors', () => {
    it('selects allowance', () => {
        assert.deepStrictEqual(all.selectAllowance(state), state.allowance.allowance)
    })

    it('selects pendingAllowance', () => {
        assert.deepStrictEqual(all.selectPendingAllowance(state), state.allowance.pendingAllowance)
    })

    it('selects fetching status for getting allowance', () => {
        assert.deepStrictEqual(all.selectGettingAllowance(state), false)
    })

    it('selects fetching status for setting allowance', () => {
        assert.deepStrictEqual(all.selectSettingAllowance(state), true)
    })

    it('selects transaction state fro setting allowance', () => {
        assert.deepStrictEqual(all.selectTransactionState(state), state.allowance.transactionState)
    })

    it('selects error', () => {
        assert.deepStrictEqual(all.selectAllowanceError(state), null)
    })
})
