import { getWalletWeb3Provider } from '~/shared/stores/wallet'

export default async function getChainId(): Promise<number> {
    return (await (await getWalletWeb3Provider()).getNetwork()).chainId
}
