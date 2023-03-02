import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import BN from 'bignumber.js'

import { getContract } from '$mp/utils/smartContract'
import { send, call } from '$mp/utils/smartContract'
import { Address, SmartContractCall, SmartContractTransaction } from "$shared/types/web3-types"
import { getConfigForChain } from '$shared/web3/config'
import marketplaceAbi from '$shared/web3/abis/marketplace.json'
import { erc20TokenContractMethods } from '$mp/utils/web3'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { gasLimits } from '$shared/utils/constants'

export const marketplaceContract = (usePublicNode = false, chainId: number): Contract => {
    const { contracts } = getConfigForChain(chainId)
    const address = contracts.MarketplaceV4 || contracts.RemoteMarketplace

    if (address == null) {
        throw new Error(`No MarketplaceV4 or RemoteMarketplace contract address found for chain ${chainId}`)
    }

    const contract = getContract({ abi: marketplaceAbi as AbiItem[], address}, usePublicNode, chainId)
    return contract
}

export const buyProject = (projectId: string, subscriptionSeconds: BN, chainId: number): SmartContractTransaction => {
    const methodToSend = marketplaceContract(false, chainId).methods.buy(
        projectId,
        subscriptionSeconds,
    )
    return send(methodToSend, {
        network: chainId,
        gas: gasLimits.BUY_PRODUCT,
    })
}

export const getTokenAllowance = async (tokenAddress: Address, chainId: number): SmartContractCall<BN> => {
    const account = await getDefaultWeb3Account()
    const allowance = await call(
        erc20TokenContractMethods(tokenAddress, false, chainId).allowance(account, marketplaceContract(false, chainId).options.address),
    )
    return new BN(allowance)
}

export const setTokenAllowance = (amount: BN, tokenAddress: Address, chainId: number): SmartContractTransaction => {
    if (amount.isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }

    const method = erc20TokenContractMethods(tokenAddress, false, chainId).approve(
        marketplaceContract(false, chainId).options.address,
        amount,
    )
    return send(method, {
        network: chainId,
    })
}
