import { ConfigTest } from 'streamr-client'
import getSideChainConfig from '$app/src/getters/getSideChainConfig'
import getMainChainConfig from '$app/src/getters/getMainChainConfig'
import isProduction from '$mp/utils/isProduction'
import { getWeb3 } from '$shared/web3/web3Provider'
import { getToken } from '$shared/utils/sessionToken'

export default function getStreamrClientConfig(options = {}) {
    const web3 = getWeb3()

    const mainChainConfig = getMainChainConfig()

    const sideChainConfig = getSideChainConfig()

    return {
        ...(!isProduction() ? ConfigTest : {}),
        autoConnect: true,
        autoDisconnect: false,
        verifySignatures: 'never',
        auth: {
            sessionToken: getToken(),
            ethereum: web3 && web3.metamaskProvider,
        },
        mainChainRPC: mainChainConfig,
        streamRegistryChainRPC: sideChainConfig,
        dataUnionChainRPC: sideChainConfig,
        ...options,
    }
}
