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
        assert.deepEqual(all.selectDataPerUsd(state), state.global.dataPerUsd)
    })

    it('selects dataPerUsd error', () => {
        assert.deepEqual(all.selectDataPerUsdError(state), null)
    })

    it('selects network is correct', () => {
        assert.deepEqual(all.selectEthereumNetworkIsCorrect(state), true)
    })

    it('selects network error', () => {
        assert.deepEqual(all.selectEthereumNetworkError(state), null)
    })
})
