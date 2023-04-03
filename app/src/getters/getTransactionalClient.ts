import StreamrClient, { ExternalProvider } from 'streamr-client'
import Web3 from 'web3'
import getWeb3 from '../utils/web3/getWeb3'
import getChainId from '../utils/web3/getChainId'

type ArgType<T> = T extends (arg: infer R) => any ? R : never

let chainId: number | undefined

type Provider = ArgType<typeof Web3.prototype.setProvider> & { chainId?: typeof chainId }

let streamrClient: StreamrClient | undefined

let provider: Provider | undefined

export default async function getTransactionalClient() {
    const { currentProvider } = getWeb3()

    const currentChainId = await getChainId()

    if (streamrClient && currentProvider === provider && currentChainId === chainId) {
        return streamrClient
    }

    chainId = currentChainId

    provider = currentProvider

    streamrClient = new StreamrClient({
        auth: {
            ethereum: currentProvider as ExternalProvider,
        },
    })

    return streamrClient
}
