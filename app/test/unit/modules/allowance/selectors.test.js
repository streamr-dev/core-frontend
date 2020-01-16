import assert from 'assert-diff'
import BN from 'bignumber.js'

import * as all from '$mp/modules/allowance/selectors'

const state = {
    test: true,
    allowance: {
        hash: 'hash',
        dataAllowance: BN(5),
        pendingDataAllowance: BN(10),
        gettingDataAllowance: false,
        getDataAllowanceError: {
            message: 'getAllowanceError',
        },
        settingDataAllowance: true,
        setDataAllowanceTx: 'setDataAllowanceTx',
        setDataAllowanceError: {
            message: 'setDataAllowanceError',
        },
        resettingDataAllowance: false,
        resetDataAllowanceTx: 'resetDataAllowanceTx',
        resetDataAllowanceError: {
            message: 'resetDataAllowanceError',
        },
    },
    otherData: 42,
    entities: {},
}

describe('allowance - selectors', () => {
    it('selects DATA allowance', () => {
        assert.deepStrictEqual(all.selectDataAllowance(state), state.allowance.dataAllowance)
    })

    it('selects pendingDataAllowance', () => {
        assert.deepStrictEqual(all.selectPendingDataAllowance(state), state.allowance.pendingDataAllowance)
    })

    it('selects fetching status for getting DATA allowance', () => {
        assert.deepStrictEqual(all.selectGettingDataAllowance(state), false)
    })

    it('selects fetching status for setting DATA allowance', () => {
        assert.deepStrictEqual(all.selectSettingDataAllowance(state), true)
    })

    it('selects the set DATA allowance transaction hash', () => {
        assert.deepStrictEqual(all.selectSetDataAllowanceTx(state), state.allowance.setDataAllowanceTx)
    })

    it('selects the set DATA allowance error', () => {
        assert.deepStrictEqual(all.selectSetDataAllowanceError(state), state.allowance.setDataAllowanceError)
    })

    it('selects fetching status for resetting DATA allowance', () => {
        assert.deepStrictEqual(all.selectResettingDataAllowance(state), false)
    })

    it('selects the reset DATA allowance transaction hash', () => {
        assert.deepStrictEqual(all.selectResetDataAllowanceTx(state), state.allowance.resetDataAllowanceTx)
    })

    it('selects the reset DATA allowance error', () => {
        assert.deepStrictEqual(all.selectResetDataAllowanceError(state), state.allowance.resetDataAllowanceError)
    })

    it('selects pending DATA allowance', () => {
        assert.deepStrictEqual(all.selectDataAllowanceOrPendingDataAllowance(state), state.allowance.pendingDataAllowance)
    })

    it('selects DATA allowance when pending DATA allowance is not defined', () => {
        const nextState = {
            ...state,
            allowance: {
                ...state.allowance,
                pendingDataAllowance: null,
            },
        }
        assert.deepStrictEqual(all.selectDataAllowanceOrPendingDataAllowance(nextState), state.allowance.dataAllowance)
    })
})
