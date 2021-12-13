import { ConfigTest } from 'streamr-client'

import isProduction from '$mp/utils/isProduction'

export default function getClientConfig(options = {}) {
    const web3 = getWeb3()

    const config = Object.assign({
        ...(!isProduction() ? ConfigTest : {}),
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        verifySignatures: 'never',
        auth: {
            ethereum: web3.metamaskProvider,
        },
        mainnet: {
            url: process.env.MAINNET_HTTP_PROVIDER,
        },
        sidechain: {
            url: process.env.SIDECHAIN_HTTP_PROVIDER,
            chainId: parseInt(process.env.SIDECHAIN_CHAIN_ID, 10),
        },
    }, options)

    return config
}
