import { z } from 'zod'
import config from '~/config.toml'
import { getConfigForChain } from '~/shared/web3/config'

const ChainConfigExtension = z.object({
    sponsorshipPaymentToken: z.string().optional().default('DATA'),
    client: z
        .object({
            graphUrl: z.string().optional(),
        })
        .optional(),
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
