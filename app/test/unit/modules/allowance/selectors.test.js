import assert from 'assert-diff'
import BN from 'bignumber.js'

import * as all from '../../../../src/marketplace/modules/allowance/selectors'

const state = {
    test: true,
    allowance: {
        hash: 'hash',
        allowance: BN(5),
        pendingAllowance: BN(10),
        gettingAllowance: false,
        getAllowanceError: {
            message: 'getAllowanceError',
        },
        settingAllowance: true,
        setAllowanceTx: 'setAllowanceTx',
        setAllowanceError: {
            message: 'setAllowanceError',
        },
        resettingAllowance: false,
        resetAllowanceTx: 'resetAllowanceTx',
        resetAllowanceError: {
            message: 'resetAllowanceError',
        },
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

    it('selects the set allowance transaction hash', () => {
        assert.deepStrictEqual(all.selectSetAllowanceTx(state), state.allowance.setAllowanceTx)
    })

    it('selects the set allowance error', () => {
        assert.deepStrictEqual(all.selectSetAllowanceError(state), state.allowance.setAllowanceError)
    })

    it('selects fetching status for resetting allowance', () => {
        assert.deepStrictEqual(all.selectResettingAllowance(state), false)
    })

    it('selects the reset allowance transaction hash', () => {
        assert.deepStrictEqual(all.selectResetAllowanceTx(state), state.allowance.resetAllowanceTx)
    })

    it('selects the reset allowance error', () => {
        assert.deepStrictEqual(all.selectResetAllowanceError(state), state.allowance.resetAllowanceError)
    })

    it('selects pending allowance', () => {
        assert.deepStrictEqual(all.selectAllowanceOrPendingAllowance(state), state.allowance.pendingAllowance)
    })

    it('selects allowance when pending allowance is not defined', () => {
        const nextState = {
            ...state,
            allowance: {
                ...state.allowance,
                pendingAllowance: null,
            },
        }
        assert.deepStrictEqual(all.selectAllowanceOrPendingAllowance(nextState), state.allowance.allowance)
    })
})
