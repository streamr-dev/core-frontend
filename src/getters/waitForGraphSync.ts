import getGraphClient from '~/getters/getGraphClient'
import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'
import { sleep } from '~/utils'

const SESSION_STORAGE_KEY = 'StreamrHubLastBlockNumber'

export const saveLastBlockNumber = (blockNumber: number): void => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ blockNumber }))
}
export const waitForGraphSync = async (): Promise<void> => {
    let done = false

    async function fn() {
        while (true) {
            if (done) {
                return
            }

            const { blockNumber } = JSON.parse(
                window.sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}',
            )

            if (!blockNumber) {
                return
            }

            let client: ReturnType<typeof getGraphClient> | undefined

            try {
                client = getGraphClient()

                const {
                    data: { _meta: meta },
                } = await client.query<GetMetadataQuery, GetMetadataQueryVariables>({
                    query: GetMetadataDocument,
                    fetchPolicy: 'network-only',
                })

                if (meta && meta.block.number >= blockNumber) {
                    return
                }
            } finally {
                await client?.clearStore()
            }

            await sleep(500)
        }
    }

    try {
        await Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Timeout'))
                }, 15000)
            }),
            fn(),
        ])
    } finally {
        done = true
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
}
