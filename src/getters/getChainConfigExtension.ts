import { produce } from 'immer'
import { z } from 'zod'
import config from '~/config/chains.toml'
import { getConfigForChain } from '~/shared/web3/config'
import formatConfigUrl from '~/utils/formatConfigUrl'

const ChainConfigExtension = z.object({
    client: z
        .object({
            networkSubgraphUrl: z.string().optional(),
        })
        .optional(),
    dataUnionJoinServerUrl: z.string().optional(),
    dockerHost: z.string().optional(),
    networkSubgraphUrl: z
        .string()
        .optional()
        .default('https://api.thegraph.com/subgraphs/name/streamr-dev/network-subgraphs'),
    sponsorshipPaymentToken: z.string().optional().default('DATA'),
    streamIndexerUrl: z
        .string()
        .optional()
        .default('https://stream-metrics.streamr.network/api'),
})

type ChainConfigExtension = z.infer<typeof ChainConfigExtension>

const fallbackChainConfigExtension: ChainConfigExtension = ChainConfigExtension.parse({})

const parsedConfig = z
    .record(z.string(), z.union([ChainConfigExtension, z.undefined()]))
    .transform((value) =>
        produce(value, (draft) => {
            Object.values(draft).forEach(function dockerizeUrls(extension) {
                if (!extension) {
                    return
                }

                const {
                    client,
                    dataUnionJoinServerUrl,
                    dockerHost,
                    networkSubgraphUrl,
                    streamIndexerUrl,
                } = extension

                if (typeof client?.networkSubgraphUrl === 'string') {
                    client.networkSubgraphUrl = formatConfigUrl(
                        client.networkSubgraphUrl,
                        {
                            dockerHost,
                        },
                    )
                }

                extension.networkSubgraphUrl = formatConfigUrl(networkSubgraphUrl, {
                    dockerHost,
                })

                if (typeof dataUnionJoinServerUrl === 'string') {
                    extension.dataUnionJoinServerUrl = formatConfigUrl(
                        dataUnionJoinServerUrl,
                        {
                            dockerHost,
                        },
                    )
                }

                if (typeof streamIndexerUrl === 'string') {
                    extension.streamIndexerUrl = formatConfigUrl(streamIndexerUrl, {
                        dockerHost,
                    })
                }
            })
        }),
    )
    .parse(config)

export function getChainConfigExtension(chainId: number) {
    const { name: chainName } = getConfigForChain(chainId)

    const chainConfigExtension = parsedConfig[chainName]

    if (!chainConfigExtension) {
        return fallbackChainConfigExtension
    }

    return chainConfigExtension
}
