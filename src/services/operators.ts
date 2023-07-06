import { gql } from '@apollo/client'
import {
    operatorFactoryABI,
    operatorABI,
    OperatorFactory,
    Operator,
} from '@streamr/network-contracts'
import { getConfigForChainByName, getConfigForChain } from '~/shared/web3/config'
import networkPreflight from '~/utils/networkPreflight'
import { getWalletWeb3Provider } from '~/shared/stores/wallet'
import { Address } from '~/shared/types/web3-types'
import { Contract } from 'ethers'
import { getERC20TokenContract } from '~/getters'
import { BNish, toBN } from '~/utils/bn'

const getOperatorChainId = () => {
    // TODO: add to .toml
    const sponsorshipChainName = 'dev1'
    const chainConfig = getConfigForChainByName(sponsorshipChainName)
    return chainConfig.id
}

gql`
    fragment OperatorFields on Operator {
        id
        stakes {
            operator {
                id
            }
            amount
            allocatedWei
            date
            sponsorship {
                id
            }
        }
        delegators {
            operator {
                id
            }
            poolTokenWei
        }
        delegatorCount
        poolValue
        totalValueInSponsorshipsWei
        freeFundsWei
        poolValueTimestamp
        poolValueBlockNumber
        poolTokenTotalSupplyWei
        exchangeRate
        metadataJsonString
        owner
    }

    query getAllOperators($first: Int, $skip: Int) {
        operators(first: $first, skip: $skip) {
            ...OperatorFields
        }
    }
`

export type OperatorParams = {
    stringArgs: [string, string]
    policies: [Address, Address, Address]
    initParams: [number, number, number, number, number, number]
}

export async function createOperator({
    stringArgs,
    policies,
    initParams,
}: OperatorParams) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getWalletWeb3Provider()

    const factory = new Contract(
        chainConfig.contracts['OperatorFactory'],
        operatorFactoryABI,
        signer,
    ) as OperatorFactory

    const tx = await factory.deployOperator(stringArgs, policies, initParams)

    await tx.wait()
}

export async function delegateToOperator(operatorId: string, amount: BNish) {
    const chainId = getOperatorChainId()

    const chainConfig = getConfigForChain(chainId)

    await networkPreflight(chainId)

    const signer = await getWalletWeb3Provider()

    const tokenContract = getERC20TokenContract({
        tokenAddress: chainConfig.contracts['DATA'],
        signer,
    })

    const tokenTx = await tokenContract.approve(operatorId, toBN(amount).toString())

    await tokenTx.wait()

    const operatorContract = new Contract(operatorId, operatorABI, signer) as Operator

    const operatorTx = await operatorContract.delegate(toBN(amount).toString())

    await operatorTx.wait()
}
