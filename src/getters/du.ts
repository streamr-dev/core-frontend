import DataUnionClient, { DataUnion } from '@dataunions/client'
import { hexToNumber } from 'web3-utils'
import { getConfigForChain } from '~/shared/web3/config'
import { TheGraph } from '~/shared/types'
import { getWalletAccount, getWalletProvider } from '~/shared/stores/wallet'
import {
    GetDataUnionsOwnedByQuery,
    GetDataUnionsOwnedByDocument,
    GetDataUnionsOwnedByQueryVariables,
} from '~/generated/gql/du'
import getClientConfig from '~/getters/getClientConfig'
import { toBN } from '~/utils/bn'
import { getDataUnionGraphClient } from '~/getters/getGraphClient'
import getCoreConfig from './getCoreConfig'

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
    })

    return data.dataUnions.map((du) => ({
        ...du,
        chainId,
    }))
}

export async function getDataUnionClient(chainId: number) {
    const provider: any = await getWalletProvider()

    const config = getConfigForChain(chainId)

    const { dataUnionJoinServerUrl } = getCoreConfig()

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

    const clientConfig = getClientConfig({
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
        ...(dataUnionJoinServerUrl
            ? {
                  joinServerUrl: dataUnionJoinServerUrl,
              }
            : {}),
    })

    return new (await require('@dataunions/client')).DataUnionClient(
        clientConfig,
    ) as DataUnionClient
}

export async function getDataUnionSecrets(dataUnionId: string, chainId: number) {
    return (await getDataUnion(dataUnionId, chainId)).listSecrets()
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

export async function getDataUnionAdminFee(dataUnionId: string, chainId: number) {
    return (await getDataUnion(dataUnionId, chainId)).getAdminFee()
}

export async function getDataUnionStats(dataUnionId: string, chainId: number) {
    const dataUnion = await getDataUnion(dataUnionId, chainId)

    const { activeMemberCount, inactiveMemberCount, totalEarnings } =
        await dataUnion.getStats()

    const active = toBN(activeMemberCount).toNumber()

    const inactive = toBN(inactiveMemberCount).toNumber()

    return {
        memberCount: {
            active,
            inactive,
            total: active + inactive,
        },
        totalEarnings: toBN(totalEarnings).toNumber(),
    }
}
