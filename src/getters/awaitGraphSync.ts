import getGraphClient from '~/getters/getGraphClient'
import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'

const SESSION_STORAGE_KEY = 'StreamrHubLastBlockNumber'

export const saveLastBlockNumber = (blockNumber: number): void => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ blockNumber }))
}
export const awaitGraphSync = async (): Promise<void> => {
    let done = false
    const { blockNumber } = JSON.parse(
        window.sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}',
    )

    if (!blockNumber) {
        return
    }

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
                    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
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
                setTimeout(() => {
                    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
                    reject(new Error('Timeout'))
                }, 15000)
            }),
            fn(),
        ])
    } finally {
        done = true
    }
}
