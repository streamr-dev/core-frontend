import { ConfigTest } from 'streamr-client'

export default function getMainChainConfig() {
    return {
        ...ConfigTest.streamRegistryChainRPC,
        chainId: Number(process.env.SIDE_CHAIN_ID || 8997),
    }
}
