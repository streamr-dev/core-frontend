import StreamrClient, { ExternalProvider } from 'streamr-client'
import Web3 from 'web3'
import getWeb3 from '../utils/web3/getWeb3'

type ArgType<T> = T extends (arg: infer R) => any ? R : never

let chainId: string | number | undefined

type Provider = ArgType<typeof Web3.prototype.setProvider> & { chainId?: typeof chainId }

let streamrClient: StreamrClient | undefined

let provider: Provider | undefined

export default function getTransactionalClient() {
    const { currentProvider } = getWeb3()

    if (streamrClient && currentProvider === provider && provider?.chainId === chainId) {
        return streamrClient
    }

    chainId = provider?.chainId

    provider = currentProvider

    streamrClient = new StreamrClient({
        auth: {
            ethereum: currentProvider as ExternalProvider,
        },
    })

    return streamrClient
}
