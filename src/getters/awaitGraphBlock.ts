import getGraphClient from '~/getters/getGraphClient'
import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'

export const awaitGraphBlock = (blockNumber: number): Promise<void> => {
    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            const client = getGraphClient()
            const {
                data: { _meta: meta },
            } = await client.query<GetMetadataQuery, GetMetadataQueryVariables>({
                query: GetMetadataDocument,
            })

            if (!!meta && meta.block.number >= blockNumber) {
                clearInterval(interval)
                resolve()
            }

            await client.clearStore()
        }, 500)

        setTimeout(() => {
            // cancel polling after 15 seconds
            clearInterval(interval)
            resolve()
        }, 15000)
    })
}
