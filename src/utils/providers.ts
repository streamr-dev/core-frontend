import { Provider } from 'ethers'
import { getStreamrClientInstance } from '~/getters/getStreamrClient'

const providers: { [chainId: number]: Provider | undefined } = {}

export async function getPublicProvider(chainId: number) {
    const provider = providers[chainId]

    if (provider) {
        return provider
    }

    const client = await getStreamrClientInstance(chainId)

    const { provider: newProvider } = await client.getSigner()

    providers[chainId] = newProvider

    return newProvider
}
