import * as all from '$mp/modules/global/selectors'

const state = {
    global: {
        networkId: undefined,
    },
}

describe('global - selectors', () => {
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
