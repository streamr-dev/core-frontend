import { type ExternalProvider } from 'streamr-client'
import { toaster } from 'toasterhea'
import SwitchNetworkModal from '../modals/SwitchNetworkModal'
import getChainId from './web3/getChainId'
import getWeb3 from './web3/getWeb3'
import { Layer } from './Layer'

interface Currency {
    decimals: number
    name: string
    symbol: string
}

interface Network {
    chainId: string
    chainName: string
    blockExplorerUrls?: string[]
    nativeCurrency?: Currency
    rpcUrls: string[]
}

type Chain = [chainId: number, network: Network]

/**
 * @TODO Chain lists and configs are in few different places around the app. My guess is,
 * the it'd be best to use `@streamr/config` here.
 */
export const Matic: Chain = [
    137,
    {
        chainId: '0x89',
        blockExplorerUrls: ['https://polygonscan.com'],
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
            decimals: 18,
            name: 'Matic',
            symbol: 'MATIC',
        },
        rpcUrls: ['https://polygon-rpc.com'],
    },
]

/**
 *
 * @param expectedChainId Expected network/chain ID, e.g. 137 for Polygon.
 * @returns `true` if the utility changed the network, and `false` if it did nothing (we're already on the correct network).
 */
export default async function networkPreflight(expectedChainId: number) {
    const provider = getWeb3().currentProvider as ExternalProvider

    if (typeof provider.request === 'undefined') {
        throw new Error('Bad provider, bad!')
    }

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

        const [, params] = Matic

        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [params],
        })
    }

    return true
}
