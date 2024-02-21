import DataUnionClient, { DataUnion } from '@dataunions/client'
import { hexToNumber } from 'web3-utils'
import {
    GetDataUnionsOwnedByDocument,
    GetDataUnionsOwnedByQuery,
    GetDataUnionsOwnedByQueryVariables,
} from '~/generated/gql/du'
import { getChainConfigExtension } from '~/getters/getChainConfigExtension'
import getClientConfig from '~/getters/getClientConfig'
import { getDataUnionGraphClient } from '~/getters/getGraphClient'
import { getWalletAccount, getWalletProvider } from '~/shared/stores/wallet'
import { TheGraph } from '~/shared/types'
import { getConfigForChain } from '~/shared/web3/config'

export async function getDataUnionsOwnedByInChain(
    account: string,
    chainId: number,
): Promise<TheGraph.DataUnion[]> {
    const client = getDataUnionGraphClient(chainId)

    const { data = { dataUnions: [] } } = await client.query<
        GetDataUnionsOwnedByQuery,
        GetDataUnionsOwnedByQueryVariables
    >({
        query: GetDataUnionsOwnedByDocument,
        variables: {
            owner: account.toLowerCase(),
        },
        fetchPolicy: 'network-only',
    })

    return data.dataUnions.map((du) => ({
        ...du,
        chainId,
    }))
}

export async function getDataUnionClient(chainId: number): Promise<DataUnionClient> {
    const provider: any = await getWalletProvider()

    const config = getConfigForChain(chainId)

    const { dataUnionJoinServerUrl: joinServerUrl } = getChainConfigExtension(chainId)

    const providerUrl = config.rpcEndpoints.find((rpc) => rpc.url.startsWith('http'))?.url

    const factoryAddress = config.contracts.DataUnionFactory

    if (!factoryAddress) {
        throw new Error(
            `No contract address for DataUnionFactory found for chain ${chainId}`,
        )
    }

    const providerChainId = hexToNumber(provider.chainId)

    const isProviderInCorrectChain = providerChainId === chainId

    const account = await getWalletAccount()

    if (!account) {
        throw new Error('No wallet connected')
    }

    const isInCorrectChainAndUnlocked = isProviderInCorrectChain

    const clientConfig = getClientConfig(chainId, {
        auth: {
            // If MetaMask is in right chain, use it to enable signing
            ethereum: isInCorrectChainAndUnlocked ? provider : undefined,
            // Otherwise use a throwaway private key to authenticate and allow read-only mode
            privateKey: !isInCorrectChainAndUnlocked
                ? '531479d5645596f264e7e3cbe80c4a52a505d60fad45193d1f6b8e4724bf0304'
                : undefined,
        },
        network: {
            chainId,
            rpcs: [
                {
                    url: providerUrl,
                    timeout: 120 * 1000,
                },
            ],
        },
        dataUnion: {
            factoryAddress,
        },
        ...(joinServerUrl
            ? {
                  joinServerUrl,
              }
            : {}),
    })

    return new (await require('@dataunions/client')).DataUnionClient(clientConfig)
}

export async function getDataUnion(
    dataUnionId: string,
    chainId: number,
): Promise<DataUnion> {
    const dataUnion = await (await getDataUnionClient(chainId)).getDataUnion(dataUnionId)

    if (!dataUnion) {
        throw new Error('Data Union not found')
    }

    return dataUnion
}

async function getDataUnionAdminFee(
    dataUnionId: string,
    chainId: number,
): Promise<number> {
    return (await getDataUnion(dataUnionId, chainId)).getAdminFee()
}

export function getDataUnionAdminFeeForSalePoint<
    T extends { beneficiary: string; domainId: number },
>(salePoint: T) {
    const { beneficiary: dataUnionId, domainId: chainId } = salePoint

    return getDataUnionAdminFee(dataUnionId, chainId)
}
