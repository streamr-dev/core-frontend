import { hexToNumber } from 'web3-utils'
import getWeb3 from '$utils/web3/getWeb3'
export default function getProviderChainId(): number {
    const provider = getWeb3().currentProvider
    const providerChainId = hexToNumber(provider.chainId)
    return providerChainId
}
