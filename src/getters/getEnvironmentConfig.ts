import { z } from 'zod'
import config from '~/config/environments.toml'

const EnvironmentConfig = z.object({
    platformOriginUrl: z.string().optional().default('https://streamr.network'),
    streamrUrl: z.string().optional().default('https://streamr.network'),
})

type EnvironmentConfig = z.infer<typeof EnvironmentConfig>

const fallbackEnvironmentConfig: EnvironmentConfig = EnvironmentConfig.parse({})

const parsedConfig = z
    .record(z.string(), z.union([EnvironmentConfig, z.undefined()]))
    .parse(config)

const { NODE_ENV: actualEnvironment = 'development' } = process.env as {
    NODE_ENV: string | undefined
}

export function getEnvironmentConfig() {
    const env = actualEnvironment === 'test' ? 'development' : actualEnvironment

    const environmentConfig = parsedConfig[env]

    if (!environmentConfig) {
        return fallbackEnvironmentConfig
    }

    return environmentConfig
}
