import { ConfigTest } from 'streamr-client'

export default function getMainChainConfig() {
    return {
        ...ConfigTest.mainChainRPC,
        chainId: process.env.MAIN_CHAIN_ID || '8995',
    }
}
