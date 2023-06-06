import { StreamrClient, ExternalProvider } from 'streamr-client'
import { getWalletProvider } from '$shared/stores/wallet'
import getChainId from '$utils/web3/getChainId'
import networkPreflight, { Matic } from '$utils/networkPreflight'

let streamrClient: StreamrClient | undefined

let provider: ExternalProvider | undefined

/**
 * @param passiveNetworkCheck A boolean telling the utility if it should pop up the "Switch network" modal
 * if the provider is on the incorrect network. Default: `false`.
 * @returns A StreamrClient instance.
 */
export default async function getTransactionalClient({ passiveNetworkCheck = false }: { passiveNetworkCheck?: boolean } = {}) {
    const currentProvider = await getWalletProvider() as any

    const [chainId] = Matic

    if (
        streamrClient &&
        currentProvider === provider &&
        (passiveNetworkCheck ? (await getChainId()) === chainId : (await networkPreflight(chainId)) === false)
    ) {
        return streamrClient
    }

    provider = currentProvider

    streamrClient = new (await require('streamr-client')).StreamrClient({
        auth: {
            ethereum: currentProvider,
        },
    })

    if (!streamrClient) {
        throw new Error('Failed to create new transactional client.')
    }

    return streamrClient
}

// Load the client library proactively so that we don't have to wait later.
setTimeout(async () => {
    try {
        await getTransactionalClient({ passiveNetworkCheck: true })
    } catch (_) {
        // Do nothing.
    }
}, 0)
