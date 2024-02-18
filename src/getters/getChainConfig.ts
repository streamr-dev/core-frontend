import { config } from '@streamr/config'
import { Chain } from '~/types'
import getCoreConfig from './getCoreConfig'

export const defaultChainConfig: Chain = config[getCoreConfig().defaultChain || 'polygon']
