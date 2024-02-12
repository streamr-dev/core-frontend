import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { PermissionAssignment } from 'streamr-client'
import getClientConfig from '~/getters/getClientConfig'
import { getCurrentChainId } from '~/getters/getCurrentChain'
import { ParsedStream, parseStream } from '~/parsers/StreamParser'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import { useCurrentChainId } from '~/shared/stores/chain'
import { isMessagedObject } from '~/utils'
import { createDraftStore, getEmptyDraft } from '~/utils/draft'

export const StreamDraft = createDraftStore<ParsedStream>({
    persist: async (_) => {},

    getEmptyDraft: () => getEmptyDraft(getEmptyStreamEntity()),

    prefix: 'StreamDraft-',
})

interface GetEmptyStreamEntityOptions {
    chainId?: number
}

export function getEmptyStreamEntity(
    options: GetEmptyStreamEntityOptions = {},
): ParsedStream {
    const { chainId } = options

    return {
        chainId: chainId ?? getCurrentChainId(),
        domain: '',
        id: undefined,
        pathname: '',
        permissions: {},
        storage: {},
        metadata: {
            description: '',
            inactivityThresholdHours: '',
            partitions: 1,
            storageDays: '',
        },
    }
}

export function useStreamEntityQuery() {
    const { id: streamId } = useParams<{ id: string }>()

    const chainId = useCurrentChainId()

    return useQuery({
        queryKey: ['useStreamEntityQuery', chainId, streamId],
        queryFn: async () => {
            if (!streamId) {
                return null
            }

            try {
                const StreamrClient = (await import('streamr-client')).default

                const client = new StreamrClient(getClientConfig(chainId))

                const stream = await client.getStream(streamId)

                if (!stream) {
                    throw new StreamNotFoundError(streamId)
                }

                const metadata = stream.getMetadata()

                let storageNodes: string[] | undefined

                try {
                    storageNodes = await client.getStorageNodes(streamId)
                } catch (e) {
                    console.warn(`Failed to load storage nodes for stream ${streamId}`, e)
                }

                let permissionAssignments: PermissionAssignment[] | undefined

                try {
                    permissionAssignments = await client.getPermissions(streamId)
                } catch (e) {
                    console.warn(`Failed to load permissions for stream ${streamId}`, e)
                }

                return parseStream(stream, {
                    chainId,
                    metadata,
                    permissionAssignments,
                    storageNodes,
                })
            } catch (e) {
                if (isMessagedObject(e) && /not.found/i.test(e.message)) {
                    throw new StreamNotFoundError(streamId)
                }

                throw e
            }
        },
        staleTime: Infinity,
        cacheTime: 0,
    })
}
