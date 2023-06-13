import { toaster } from 'toasterhea'
import SwitchNetworkModal from '$app/src/modals/SwitchNetworkModal'
import getChainId from '$utils/web3/getChainId'
import { Layer } from '$utils/Layer'
import { getWalletProvider } from '$shared/stores/wallet'
import { defaultChainConfig } from '$app/src/getters/getChainConfig'

/**
 *
 * @param expectedChainId Expected network/chain ID, e.g. 137 for Polygon.
 * @returns `true` if the utility changed the network, and `false` if it did nothing (we're already on the correct network).
 */
export default async function networkPreflight(expectedChainId: number) {
    const provider = await getWalletProvider()

    try {
        const currentChainId = await getChainId()

        if (currentChainId === expectedChainId) {
            return false
        }

        await toaster(SwitchNetworkModal, Layer.Modal).pop({
            expectedNetwork: expectedChainId,
            actualNetwork: currentChainId,
        })

        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: `0x${expectedChainId.toString(16)}`,
                },
            ],
        })
    } catch (e: any) {
        if (e?.code !== 4902) {
            throw e
        }

        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: `0x${defaultChainConfig.id.toString(16)}`,
                    chainName: defaultChainConfig.name,
                    rpcUrls: defaultChainConfig.rpcEndpoints.map(
                        (rpcEndpoint) => rpcEndpoint.url,
                    ),
                },
            ],
        })
    }

    return true
}
