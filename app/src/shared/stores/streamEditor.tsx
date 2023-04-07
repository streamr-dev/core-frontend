import type StreamrClient from 'streamr-client'
import { create } from 'zustand'
import produce from 'immer'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { useClient } from 'streamr-client-react'
import { PermissionAssignment, Stream, StreamMetadata, StreamPermission } from 'streamr-client'
import uniqueId from 'lodash/uniqueId'
import address0 from '$app/src/utils/address0'
import NoStreamIdError from '$shared/errors/NoStreamIdError'
import getTransactionalClient from '$app/src/getters/getTransactionalClient'
import { Toaster, toaster } from 'toasterhea'
import { Layer } from '$app/src/utils/Layer'
import TransactionListToast, { Operation } from '$shared/toasts/TransactionListToast'

type ErrorKey = 'streamId' | keyof StreamMetadata

export class DraftValidationError extends Error {
    name = 'DraftValidationError'

    constructor(readonly key: ErrorKey, readonly message: string) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DraftValidationError)
        }

        Object.setPrototypeOf(this, DraftValidationError.prototype)
    }
}

interface Actions {
    fetchPermissions(draftId: string, streamrClient: StreamrClient): Promise<void>
    fetchStorageNodes: (draftId: string, streamrClient: StreamrClient) => Promise<void>
    fetchStream: (draftId: string, streamrClient: StreamrClient) => Promise<void>
    init: (draftId: string, streamId: string | undefined, streamrClient: StreamrClient) => void
    persist: (draftId: string) => Promise<void>
    setError: (draftId: string, key: ErrorKey, message: string) => void
    setPermissions: (draftId: string, account: string, bits: number | null) => void
    setTransientStreamId: (draftId: string, streamId: string) => void
    toggleStorageNode: (draftId: string, address: string, fn: (enabled: boolean) => boolean) => void
    updateMetadata: (draftId: string, update: (chunk: StreamMetadata) => void) => void
    teardown: (draftId: string, options?: { onlyAbandoned?: boolean }) => void
}

interface StorageNodeManifest {
    enabled: boolean
    persistedEnabled: boolean | null
}

interface Draft {
    abandoned: boolean
    errors: Partial<Record<'streamId' | keyof StreamMetadata, string>>
    fetchingStream: boolean
    loadedMetadata: StreamMetadata
    metadata: StreamMetadata
    metadataChanged: boolean
    permissionAssignments: PermissionAssignment[]
    persisting: boolean
    storageNodes: Partial<Record<string, StorageNodeManifest>>
    fetchingStorageNodes: boolean
    streamId: string | undefined
    transientStreamId: string
    fetchingPermissions: boolean
    permissions: Partial<
        Record<
            string,
            {
                bits: number | null
                persistedBits: number | null
            }
        >
    >
}

interface State {
    cache: Partial<Record<string, Draft>>
}

const initialState: State = {
    cache: {},
}

const initialMetadata: StreamMetadata = {
    description: '',
    config: {
        fields: [],
    },
    storageDays: undefined,
    inactivityThresholdHours: undefined,
    partitions: 1,
}

const initialDraft: Draft = {
    abandoned: false,
    errors: {},
    fetchingStream: false,
    loadedMetadata: initialMetadata,
    metadata: initialMetadata,
    metadataChanged: false,
    permissionAssignments: [],
    permissions: {},
    fetchingPermissions: false,
    persisting: false,
    storageNodes: {},
    fetchingStorageNodes: false,
    streamId: undefined,
    transientStreamId: '',
}

export const Bits: Record<StreamPermission, number> = {
    [StreamPermission.DELETE]: /*    */ 1 << 0,
    [StreamPermission.EDIT]: /*      */ 1 << 1,
    [StreamPermission.GRANT]: /*     */ 1 << 2,
    [StreamPermission.PUBLISH]: /*   */ 1 << 3,
    [StreamPermission.SUBSCRIBE]: /* */ 1 << 4,
}

export function setBits(bitsA: number, bitsB: number) {
    return (bitsA |= bitsB)
}

export function unsetBits(bitsA: number, bitsB: number) {
    return (bitsA &= ~bitsB)
}

export function matchBits(bitsA: number, bitsB: number) {
    return (bitsA & bitsB) === bitsA
}

function formatStorageOperationLabel(current = 0, total = 0) {
    if (total <= 1) {
        return 'Update storage nodes'
    }

    return `Update storage nodes (${current} of ${total})`
}

export const useStreamEditorStore = create<Actions & State>((set, get) => {
    function isPersisting(draftId: string) {
        return get().cache[draftId]?.persisting === true
    }

    function getStreamId(draftId: string) {
        const streamId = get().cache[draftId]?.streamId

        if (!streamId) {
            throw new NoStreamIdError()
        }

        return streamId
    }

    function setDraft(draftId: string, update: (draft: Draft) => void, { force = false }: { force?: boolean } = {}) {
        set((draft) =>
            produce(draft, (state) => {
                if (!state.cache[draftId] && !force) {
                    return
                }

                state.cache[draftId] = produce(state.cache[draftId] || initialDraft, update)
            }),
        )
    }

    return {
        ...initialState,

        init(draftId, streamId, streamrClient) {
            setDraft(
                draftId,
                (state) => {
                    state.streamId = streamId
                },
                {
                    force: true,
                },
            )

            if (!streamId) {
                return
            }

            async function fetchStorageNodes() {
                try {
                    await get().fetchStorageNodes(draftId, streamrClient)
                } catch (e) {
                    console.warn('Could not load storage nodes', e)
                }
            }

            fetchStorageNodes()

            async function fetchPermissions() {
                try {
                    await get().fetchPermissions(draftId, streamrClient)
                } catch (e) {
                    console.warn('Could not fetch permissions', e)
                }
            }

            fetchPermissions()
        },

        async fetchStream(draftId, streamrClient) {
            const streamId = getStreamId(draftId)

            let stream: Stream | undefined

            try {
                setDraft(draftId, (state) => {
                    state.fetchingStream = true
                })

                try {
                    stream = await streamrClient.getStream(streamId)
                } catch (e) {
                    // Do nothing.
                }

                if (!stream) {
                    throw new Error('Stream could not be loaded')
                }
            } finally {
                setDraft(draftId, (state) => {
                    if (stream) {
                        state.metadata = stream.getMetadata()

                        state.loadedMetadata = state.metadata

                        state.metadataChanged = false
                    }

                    state.fetchingStream = false
                })
            }
        },

        updateMetadata(draftId, update) {
            setDraft(draftId, (state) => {
                state.metadata = produce(state.metadata, update)

                state.metadataChanged = !isEqual(state.metadata, state.loadedMetadata)
            })
        },

        async fetchStorageNodes(draftId: string, streamrClient: StreamrClient) {
            if (isPersisting(draftId)) {
                return
            }

            try {
                setDraft(draftId, (state) => {
                    state.fetchingStorageNodes = true
                })

                const streamId = getStreamId(draftId)

                const storageNodes = await streamrClient.getStorageNodes(streamId)

                const result: Draft['storageNodes'] = {}

                storageNodes.forEach((address) => {
                    result[address.toLowerCase()] = {
                        enabled: true,
                        persistedEnabled: true,
                    }
                })

                setDraft(draftId, (state) => {
                    state.storageNodes = result
                })
            } finally {
                setDraft(draftId, (state) => {
                    state.fetchingStorageNodes = false
                })
            }
        },

        toggleStorageNode(draftId: string, address: string, fn: (enabled: boolean) => boolean) {
            if (isPersisting(draftId)) {
                return
            }

            const addr = address.toLowerCase()

            setDraft(draftId, (state) => {
                if (state.fetchingStorageNodes) {
                    return
                }

                const node = state.storageNodes[addr]

                const enabled = fn(!!node?.enabled)

                if (node?.enabled === enabled) {
                    // Nothing to do.
                    return
                }

                if (node && typeof node.persistedEnabled === null && !enabled) {
                    // Abandon local mods.
                    return void delete state.storageNodes[addr]
                }

                if (node) {
                    return void (node.enabled = enabled)
                }

                if (!enabled) {
                    // No `node` and we're disabling? Do nothing.
                    return
                }

                state.storageNodes[addr] = {
                    enabled,
                    persistedEnabled: null,
                }
            })
        },

        async persist(draftId: string) {
            if (isPersisting(draftId)) {
                return
            }

            const {
                transientStreamId = '',
                streamId,
                metadata,
                metadataChanged,
                permissionAssignments,
                storageNodes,
            } = get().cache[draftId] || initialDraft

            let stream: Stream | undefined

            let client: StreamrClient | undefined

            let toast: Toaster<typeof TransactionListToast> | undefined = toaster(TransactionListToast, Layer.Toast)

            const updateOperation: Operation = {
                id: uniqueId('operation-'),
                label: streamId ? 'Update stream' : 'Create stream',
            }

            const permissionsOperation: Operation = {
                id: uniqueId('operation-'),
                label: 'Update access settings',
            }

            const storageOperation: Operation = {
                id: uniqueId('operation-'),
                label: '',
            }

            const operations: Operation[] = []

            if (transientStreamId || metadataChanged) {
                operations.push(updateOperation)
            }

            if (permissionAssignments.length) {
                operations.push(permissionsOperation)
            }

            const storageNodeChanges: [string, boolean][] = Object.entries(storageNodes)
                .filter(([, { enabled = false, persistedEnabled = false } = {}]) => !enabled !== !persistedEnabled)
                .map(([address, { enabled = false } = {}]) => [address, !!enabled])

            storageOperation.label = formatStorageOperationLabel(0, storageNodeChanges.length)

            if (storageNodeChanges.length) {
                operations.push(storageOperation)
            }

            if (operations.length === 0) {
                return
            }

            function notify() {
                setTimeout(async () => {
                    try {
                        if (!toast) {
                            return
                        }

                        await toast.pop({ operations: [...operations] })
                    } catch (_) {
                        // Do nothing
                    }
                }, 0)
            }

            const firstOperation = operations[0]

            firstOperation.state = 'ongoing'

            if (firstOperation === storageOperation) {
                firstOperation.label = formatStorageOperationLabel(0, storageNodeChanges.length)
            }

            notify()

            try {
                setDraft(draftId, (draft) => {
                    draft.persisting = true
                })

                if (!transientStreamId && !streamId) {
                    throw new DraftValidationError('streamId', 'is required')
                }

                if (transientStreamId) {
                    client = await getTransactionalClient({ passiveNetworkCheck: true })

                    try {
                        if (await client.getStream(transientStreamId)) {
                            throw new DraftValidationError('streamId', 'already exists, please try a different one')
                        }
                    } catch (e) {
                        if (e instanceof DraftValidationError) {
                            throw e
                        }

                        // Ignore other errors.
                    }
                }

                // @TODO Check balance!

                stream = await (async () => {
                    client = await getTransactionalClient()

                    if (transientStreamId) {
                        return client.createStream({
                            id: transientStreamId,
                            ...metadata,
                        })
                    }

                    if (!streamId) {
                        throw new DraftValidationError('streamId', 'is invalid')
                    }

                    if (metadataChanged) {
                        return client.updateStream({
                            ...metadata,
                            id: streamId,
                        })
                    }

                    return client.getStream(streamId)
                })()

                updateOperation.state = 'complete'

                permissionsOperation.state = 'ongoing'

                notify()

                if (permissionAssignments.length) {
                    client = await getTransactionalClient()

                    await client.setPermissions({
                        streamId: stream.id,
                        assignments: permissionAssignments,
                    })
                }

                permissionsOperation.state = 'complete'

                storageOperation.state = 'ongoing'

                notify()

                for (let i = 0; i < storageNodeChanges.length; i++) {
                    const [address, enabled] = storageNodeChanges[i]

                    storageOperation.label = formatStorageOperationLabel(i + 1, storageNodeChanges.length)

                    if (i !== 0) {
                        // Already notifying above.
                        notify()
                    }

                    client = await getTransactionalClient()

                    if (enabled) {
                        await client.addStreamToStorageNode(stream.id, address)

                        continue
                    }

                    await client.removeStreamFromStorageNode(stream.id, address)
                }

                storageOperation.state = 'complete'

                notify()
            } catch (e) {
                operations.forEach((op) => {
                    if (op.state === 'ongoing') {
                        op.state = 'error'
                    }
                })

                notify()

                throw e
            } finally {
                setDraft(draftId, (draft) => {
                    draft.persisting = false
                })

                setTimeout(() => {
                    toast?.discard()

                    toast = undefined
                }, 1000)

                get().teardown(draftId, { onlyAbandoned: true })
            }
        },

        setTransientStreamId(draftId, streamId) {
            setDraft(draftId, (state) => {
                state.transientStreamId = streamId
            })
        },

        async fetchPermissions(draftId: string, streamrClient: StreamrClient) {
            if (isPersisting(draftId)) {
                return
            }

            const streamId = getStreamId(draftId)

            try {
                setDraft(draftId, (state) => {
                    state.fetchingPermissions = true
                })

                const permissions = await streamrClient.getPermissions(streamId)

                const result: Draft['permissions'] = {}

                permissions.forEach((pa) => {
                    const user = 'user' in pa ? pa.user.toLowerCase() : address0

                    const cache = result[user] || {
                        bits: 0,
                        persistedBits: 0,
                    }

                    cache.bits = pa.permissions.reduce((memo, permission) => memo | Bits[permission], cache.bits || 0)

                    cache.persistedBits = cache.bits

                    result[user] = cache
                })

                setDraft(draftId, (state) => {
                    state.permissions = result
                })
            } finally {
                setDraft(draftId, (state) => {
                    state.fetchingPermissions = false
                })
            }
        },

        setPermissions(draftId, account, bits) {
            if (isPersisting(draftId)) {
                return
            }

            setDraft(draftId, (state) => {
                if (state.fetchingPermissions) {
                    return
                }

                const addr = account.toLowerCase()

                const entry = state.permissions[addr] || {
                    bits: null,
                    persistedBits: null,
                }

                entry.bits = bits

                state.permissions[addr] = entry

                const assignments: PermissionAssignment[] = []

                Object.entries(state.permissions).forEach(([account, { bits = null, persistedBits = null } = {}]) => {
                    if (bits === persistedBits || (!bits && !persistedBits)) {
                        return
                    }

                    const permissions: StreamPermission[] = !bits
                        ? []
                        : (Object.keys(Bits).filter((perm) => matchBits(Bits[perm], bits)) as StreamPermission[])

                    if (account === address0) {
                        return void assignments.push({
                            public: true,
                            permissions,
                        })
                    }

                    assignments.push({
                        user: account,
                        permissions,
                    })
                })

                state.permissionAssignments = assignments
            })
        },

        setError(draftId, key, message) {
            setDraft(draftId, (state) => {
                if (!message) {
                    return void delete state.errors[key]
                }

                state.errors[key] = message
            })
        },

        teardown(draftId, { onlyAbandoned = false } = {}) {
            set((store) =>
                produce(store, ({ cache }) => {
                    const draft = cache[draftId]

                    const { abandoned = false } = draft || {}

                    if (draft) {
                        draft.abandoned = true
                    }

                    if (!draft || draft.persisting) {
                        return
                    }

                    if (!onlyAbandoned || abandoned) {
                        delete cache[draftId]
                    }
                }),
            )
        },
    }
})

export function useInitStreamDraft(streamId: Draft['streamId']) {
    const [draftId] = useState(() => uniqueId('draft-'))

    const { init, teardown } = useStreamEditorStore(({ init, teardown }) => ({ init, teardown }))

    const client = useClient()

    useEffect(() => {
        if (client) {
            init(draftId, streamId, client)
        }
    }, [draftId, init, teardown, client])

    useEffect(
        () => () => {
            teardown(draftId)
        },
        [draftId, teardown],
    )

    return draftId
}

export const StreamDraftContext = createContext<string | undefined>(undefined)

export function useDraftId() {
    return useContext(StreamDraftContext)
}

export function useCurrentDraft() {
    const draftId = useDraftId()

    const cache = useStreamEditorStore(({ cache }) => (draftId ? cache[draftId] : undefined)) || initialDraft

    return cache
}

export function useIsCurrentDraftClean() {
    const { metadataChanged, permissionAssignments, storageNodes, transientStreamId } = useCurrentDraft()

    return (
        !transientStreamId &&
        !metadataChanged &&
        !permissionAssignments.length &&
        !Object.values(storageNodes).some(
            ({ enabled = false, persistedEnabled = false }: Partial<StorageNodeManifest> = {}) => !enabled !== !persistedEnabled,
        )
    )
}

export function useIsCurrentDraftBusy() {
    const { fetchingStream, persisting, fetchingPermissions, fetchingStorageNodes } = useCurrentDraft()

    return fetchingStream || persisting || fetchingPermissions || fetchingStorageNodes
}

export function useUpdateCurrentMetadata() {
    const draftId = useDraftId()

    const updateMetadata = useStreamEditorStore(({ updateMetadata }) => updateMetadata)

    return useCallback(
        (fn: (metadata: StreamMetadata) => void) => {
            if (!draftId) {
                return
            }

            updateMetadata(draftId, fn)
        },
        [draftId, updateMetadata],
    )
}

export function useSetCurrentDraftError() {
    const draftId = useDraftId()

    const setError = useStreamEditorStore(({ setError }) => setError)

    return useCallback(
        (key: ErrorKey, message: string) => {
            if (!draftId) {
                return
            }

            setError(draftId, key, message)
        },
        [draftId, setError],
    )
}

export function useCurrentDraftError(key: ErrorKey) {
    return useCurrentDraft().errors[key] || undefined
}

export function useSetCurrentDraftTransientStreamId() {
    const draftId = useDraftId()

    const setTransientStreamId = useStreamEditorStore(({ setTransientStreamId }) => setTransientStreamId)

    return useCallback(
        (streamId: string) => {
            if (!draftId) {
                return
            }

            setTransientStreamId(draftId, streamId)
        },
        [draftId, setTransientStreamId],
    )
}

export function useToggleCurrentStorageNode() {
    const draftId = useDraftId()

    const toggleStorageNode = useStreamEditorStore(({ toggleStorageNode }) => toggleStorageNode)

    return useCallback(
        (address: string, fn: (enabled: boolean) => boolean) => {
            if (!draftId) {
                return
            }

            toggleStorageNode(draftId, address, fn)
        },
        [draftId, toggleStorageNode],
    )
}

export function usePersistCurrentDraft() {
    const draftId = useDraftId()

    const persist = useStreamEditorStore(({ persist }) => persist)

    return useCallback(async () => {
        if (!draftId) {
            throw new Error('No draft id')
        }

        return persist(draftId)
    }, [draftId, persist])
}

export function usePersistingDraftIdsForStream(streamId: string | undefined) {
    return useStreamEditorStore(({ cache }) =>
        streamId
            ? Object.entries(cache)
                  .filter(([, draft]) => draft?.streamId === streamId && draft?.persisting)
                  .map(([draftId]) => draftId)
            : [],
    )
}
