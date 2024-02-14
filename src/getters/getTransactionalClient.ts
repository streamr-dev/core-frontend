import { getWalletProvider } from '~/shared/stores/wallet'
import networkPreflight from '~/utils/networkPreflight'
import getClientConfig from './getClientConfig'
import { getStreamrClient } from '.'

export default async function getTransactionalClient(chainId: number) {
    const currentProvider = (await getWalletProvider()) as any

    const StreamrClient = await getStreamrClient()

    await networkPreflight(chainId)

    const client = new StreamrClient(
        getClientConfig(chainId, {
            auth: {
                ethereum: currentProvider,
            },
        }),
    )

    return client
}
