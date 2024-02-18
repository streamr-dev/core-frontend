import { z } from 'zod'
import config from '~/config/chains.toml'
import { getConfigForChain } from '~/shared/web3/config'

const ChainConfigExtension = z.object({
    client: z
        .object({
            graphUrl: z.string().optional(),
        })
        .optional(),
    dataUnionJoinServerUrl: z.string().optional(),
    sponsorshipPaymentToken: z.string().optional().default('DATA'),
})

type ChainConfigExtension = z.infer<typeof ChainConfigExtension>

const fallbackChainConfigExtension: ChainConfigExtension = ChainConfigExtension.parse({})

const parsedConfig = z
    .record(z.string(), z.union([ChainConfigExtension, z.undefined()]))
    .parse(config)

export function getChainConfigExtension(chainId: number) {
    const { name: chainName } = getConfigForChain(chainId)

    const chainConfigExtension = parsedConfig[chainName]

    if (!chainConfigExtension) {
        return fallbackChainConfigExtension
    }

    return chainConfigExtension
}
