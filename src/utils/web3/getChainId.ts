import { getWalletWeb3Provider } from '~/shared/stores/wallet'

/**
 * @returns the chainId of whatever network is selected in the user wallet
 */
export default async function getChainId(): Promise<number> {
    const chainId = (await (await getWalletWeb3Provider()).getNetwork()).chainId

    if (chainId < Number.MIN_SAFE_INTEGER || chainId > Number.MAX_SAFE_INTEGER) {
        throw new Error('BigInt chainIds are not supported')
    }

    return Number(chainId)
}
