import * as config from '@streamr/config'
export const defaultChainConfig: config.Chain =
    process.env.HUB_CONFIG_ENV === 'production'
        ? config.Chains.load().polygon
        : config.Chains.load().dev1
