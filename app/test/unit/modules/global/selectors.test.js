import * as all from '$mp/modules/global/selectors'

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
        expect(all.selectDataPerUsd(state)).toStrictEqual(state.global.dataPerUsd)
    })

    it('selects dataPerUsd error', () => {
        expect(all.selectDataPerUsdError(state)).toStrictEqual(null)
    })

    it('selects network is correct', () => {
        expect(all.selectEthereumNetworkIsCorrect(state)).toStrictEqual(true)
    })

    it('selects network error', () => {
        expect(all.selectEthereumNetworkError(state)).toStrictEqual(null)
    })
})
