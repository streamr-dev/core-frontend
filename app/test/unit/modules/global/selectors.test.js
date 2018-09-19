import assert from 'assert-diff'

import * as all from '../../../../src/modules/global/selectors'

const state = {
    global: {
        dataPerUsd: 1,
        ethereumNetworkIsCorrect: true,
        checkingNetwork: false,
        fetchingDataPerUsdRate: false,
        ethereumNetworkError: null,
        dataPerUsdRateError: null,
    },
}

describe('global - selectors', () => {
    it('selects dataPerUsd', () => {
        assert.deepStrictEqual(all.selectDataPerUsd(state), state.global.dataPerUsd)
    })

    it('selects dataPerUsd error', () => {
        assert.deepStrictEqual(all.selectDataPerUsdError(state), null)
    })

    it('selects network is correct', () => {
        assert.deepStrictEqual(all.selectEthereumNetworkIsCorrect(state), true)
    })

    it('selects network error', () => {
        assert.deepStrictEqual(all.selectEthereumNetworkError(state), null)
    })
})
