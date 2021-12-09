import * as all from '$mp/modules/global/selectors'

const state = {
    global: {
        dataPerUsd: 1,
        fetchingDataPerUsdRate: false,
        dataPerUsdRateError: null,
        networkId: undefined,
    },
}

describe('global - selectors', () => {
    it('selects dataPerUsd', () => {
        expect(all.selectDataPerUsd(state)).toStrictEqual(state.global.dataPerUsd)
    })

    it('selects dataPerUsd error', () => {
        expect(all.selectDataPerUsdError(state)).toStrictEqual(null)
    })

    it('selects network', () => {
        expect(all.selectEthereumNetworkId(state)).toStrictEqual(undefined)
    })

    it('selects network', () => {
        expect(all.selectEthereumNetworkId({
            global: {
                ...state.global,
                networkId: '1',
            },
        })).toStrictEqual('1')
    })
})
