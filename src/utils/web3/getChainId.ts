import { getWalletWeb3Provider } from '~/shared/stores/wallet'

/**
 * @returns the chainId of whatever network is selected in the user wallet
 */
export default async function getChainId(): Promise<number> {
    return (await (await getWalletWeb3Provider()).getNetwork()).chainId
}
