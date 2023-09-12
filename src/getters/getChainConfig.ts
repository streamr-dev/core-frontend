import { config } from '@streamr/config'
import { Chain } from '~/shared/types/web3-types'
import getCoreConfig from './getCoreConfig'
export const defaultChainConfig: Chain = config[getCoreConfig().defaultChain || 'polygon']
