import getGraphClient from '~/getters/getGraphClient'
import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'

export const awaitGraphBlock = async (blockNumber: number): Promise<void> => {
    let done = false

    async function fn() {
        while (true) {
            if (done) {
                return
            }

            let client: ReturnType<typeof getGraphClient> | undefined

            try {
                client = getGraphClient()

                const {
                    data: { _meta: meta },
                } = await client.query<GetMetadataQuery, GetMetadataQueryVariables>({
                    query: GetMetadataDocument,
                })

                if (meta && meta.block.number >= blockNumber) {
                    return
                }
            } finally {
                await client?.clearStore()
            }

            await new Promise((resolve) => void setTimeout(resolve, 500))
        }
    }

    try {
        await Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => void reject(new Error('Timeout')), 15000)
            }),
            fn(),
        ])
    } finally {
        done = true
    }
    /*return new Promise((resolve) => {
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
    })*/
}
