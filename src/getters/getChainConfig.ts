import { config } from '@streamr/config'
import { Chain } from '~/shared/types/web3-types'
export const defaultChainConfig: Chain =
    (process.env.HUB_CONFIG_ENV || process.env.NODE_ENV) !== 'production'
        ? config.dev2
        : config.polygon
