import type StreamrClient from 'streamr-client'
import { produce } from 'immer'
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useClient } from 'streamr-client-react'
import {
    PermissionAssignment,
    Stream,
    StreamMetadata,
    StreamPermission,
} from 'streamr-client'
import styled from 'styled-components'
import uniqueId from 'lodash/uniqueId'
import { Link, useMatch } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import { create } from 'zustand'
import { address0 } from '~/consts'
import NoStreamIdError from '~/shared/errors/NoStreamIdError'
import getTransactionalClient from '~/getters/getTransactionalClient'
import { Operation } from '~/shared/toasts/TransactionListToast'
import routes from '~/routes'
import requirePositiveBalance from '~/shared/utils/requirePositiveBalance'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import { isMessagedObject } from '~/utils'
import { DraftValidationError } from '~/errors'
import { toastedOperations } from '~/utils/toastedOperation'

type ErrorKey = 'streamId' | keyof StreamMetadata

interface Actions {
    fetchPermissions(draftId: string, streamrClient: StreamrClient): Promise<void>
    fetchStorageNodes: (draftId: string, streamrClient: StreamrClient) => Promise<void>
    fetchStream: (draftId: string, streamrClient: StreamrClient) => Promise<void>
    init: (
        draftId: string,
        streamId: string | undefined,
        streamrClient: StreamrClient,
    ) => void
    persist: (
        draftId: string,
        {
            onCreate,
        }: {
            onCreate?: (streamId: string) => void
            onPermissionsChange?: (
                streamId: string,
                assignments: PermissionAssignment[],
            ) => void
        },
    ) => Promise<void>
    setError: (draftId: string, key: ErrorKey, message: string) => void
    setPermissions: (draftId: string, account: string, bits: number | null) => void
    setTransientStreamId: (draftId: string, streamId: string) => void
    toggleStorageNode: (
        draftId: string,
        address: string,
        fn: (enabled: boolean) => boolean,
    ) => void
    updateMetadata: (draftId: string, update: (chunk: StreamMetadata) => void) => void
    teardown: (draftId: string, options?: { onlyAbandoned?: boolean }) => void
    abandon: (draftId: string) => void
    reset: () => void
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
    loadError: unknown
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
    streamDraftMapping: Partial<Record<string, string>>
    cache: Partial<Record<string, Draft>>
}

const initialState: State = {
    streamDraftMapping: {},
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
    loadError: undefined,
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

    function setDraft(
        draftId: string,
        update: (draft: Draft) => void,
        { force = false }: { force?: boolean } = {},
    ) {
        set((draft) =>
            produce(draft, (state) => {
                if (!state.cache[draftId] && !force) {
                    return
                }

                state.cache[draftId] = produce(
                    state.cache[draftId] || initialDraft,
                    update,
                )
            }),
        )
    }

    return {
        ...initialState,

        init(draftId, streamId, streamrClient) {
            const recycled = !!get().cache[draftId]

            setDraft(
                draftId,
                (draft) => {
                    draft.streamId = streamId

                    draft.abandoned = false
                },
                {
                    force: true,
                },
            )

            if (!streamId) {
                setDraft(draftId, (next) => {
                    next.loadError = null
                })

                return
            }

            if (recycled) {
                return
            }

            get().fetchStream(draftId, streamrClient)

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

                stream = await streamrClient.getStream(streamId)

                if (!stream) {
                    throw new StreamNotFoundError(streamId)
                }

                setDraft(draftId, (next) => {
                    next.loadError = null
                })
            } catch (e: unknown) {
                if (isMessagedObject(e) && /not.found/i.test(e.message)) {
                    return void setDraft(draftId, (next) => {
                        next.loadError = new StreamNotFoundError(streamId)
                    })
                }

                setDraft(draftId, (next) => {
                    next.loadError = e
                })
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

        toggleStorageNode(
            draftId: string,
            address: string,
            fn: (enabled: boolean) => boolean,
        ) {
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

        async persist(draftId: string, { onCreate, onPermissionsChange }) {
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

            const shouldUpdateMetadata = !!transientStreamId || metadataChanged

            if (shouldUpdateMetadata) {
                operations.push(updateOperation)
            }

            const shouldUpdatePermissions = permissionAssignments.length > 0

            if (shouldUpdatePermissions) {
                operations.push(permissionsOperation)
            }

            const storageNodeChanges: [string, boolean][] = Object.entries(storageNodes)
                .filter(
                    ([, { enabled = false, persistedEnabled = false } = {}]) =>
                        !enabled !== !persistedEnabled,
                )
                .map(([address, { enabled = false } = {}]) => [address, !!enabled])

            storageOperation.label = formatStorageOperationLabel(
                0,
                storageNodeChanges.length,
            )

            const shouldUpdateStorage = storageNodeChanges.length > 0

            if (shouldUpdateStorage) {
                operations.push(storageOperation)
            }

            if (!operations.length) {
                return
            }

            async function checkBalance() {
                const address = await client?.getAddress()

                if (address) {
                    await requirePositiveBalance(address)
                }
            }

            try {
                setDraft(draftId, (draft) => {
                    draft.persisting = true
                })

                await toastedOperations(operations, async (next, refresh) => {
                    if (!transientStreamId && !streamId) {
                        throw new DraftValidationError('streamId', 'is required')
                    }

                    if (streamId) {
                        /**
                         * Assign a draft to a stream id for later re-use. Based
                         * on this information we can recycle drafts that haven't
                         * been abandoned.
                         */
                        set((store) =>
                            produce(store, ({ streamDraftMapping }) => {
                                streamDraftMapping[streamId] = draftId
                            }),
                        )
                    }

                    if (shouldUpdateMetadata && streamId) {
                        updateOperation.action = getOpenStreamLink(streamId)

                        refresh()
                    }

                    if (transientStreamId) {
                        client = await getTransactionalClient({
                            passiveNetworkCheck: true,
                        })

                        try {
                            if (await client.getStream(transientStreamId)) {
                                throw new DraftValidationError(
                                    'streamId',
                                    'already exists, please try a different one',
                                )
                            }
                        } catch (e) {
                            if (e instanceof DraftValidationError) {
                                throw e
                            }

                            if (
                                !isMessagedObject(e) ||
                                !/stream not found/i.test(e.message)
                            ) {
                                throw new DraftValidationError(
                                    'streamId',
                                    'failed to verify uniqueness',
                                )
                            }

                            /**
                             * At this point we know that the error thrown above tells us that
                             * the stream with the given id hasn't been found. Good, onwards!
                             */
                        }
                    }

                    stream = await (async () => {
                        /**
                         * Whatever happens in here we end up fetching a stream instance. Conditions
                         * dictate if it's a new stream or an existing stream (optionally updated).
                         */

                        client = await getTransactionalClient()

                        if (transientStreamId) {
                            await checkBalance()

                            return client.createStream({
                                id: transientStreamId,
                                ...metadata,
                            })
                        }

                        if (!streamId) {
                            throw new DraftValidationError('streamId', 'is invalid')
                        }

                        if (metadataChanged) {
                            await checkBalance()

                            return client.updateStream({
                                ...metadata,
                                id: streamId,
                            })
                        }

                        return client.getStream(streamId)
                    })()

                    const currentStreamId = stream.id

                    const currentMetadata = stream.getMetadata()

                    setDraft(draftId, (draft) => {
                        draft.streamId = currentStreamId

                        draft.transientStreamId = ''

                        draft.loadedMetadata = currentMetadata

                        draft.metadata = currentMetadata

                        draft.metadataChanged = false
                    })

                    if (transientStreamId) {
                        /**
                         * Again, associate the current draft with the (new) stream
                         * id for later recycling purposes.
                         */
                        set((store) =>
                            produce(store, ({ streamDraftMapping }) => {
                                streamDraftMapping[currentStreamId] = draftId
                            }),
                        )

                        onCreate?.(currentStreamId)
                    }

                    if (shouldUpdateMetadata) {
                        updateOperation.action = getOpenStreamLink(currentStreamId)

                        /**
                         * We've either created a stream or updated one that exists. Onwards!
                         */
                        next()
                    }

                    if (shouldUpdatePermissions) {
                        client = await getTransactionalClient()

                        await checkBalance()

                        await client.setPermissions({
                            streamId: currentStreamId,
                            assignments: permissionAssignments,
                        })

                        onPermissionsChange?.(currentStreamId, permissionAssignments)

                        setDraft(draftId, (draft) => {
                            draft.permissionAssignments = []

                            for (const addr in draft.permissions) {
                                const cache = draft.permissions[addr]

                                if (
                                    !cache ||
                                    !Object.prototype.hasOwnProperty.call(
                                        draft.permissions,
                                        addr,
                                    )
                                ) {
                                    continue
                                }

                                cache.persistedBits = cache.bits
                            }
                        })

                        next()
                    }

                    for (let i = 0; i < storageNodeChanges.length; i++) {
                        const [address, enabled] = storageNodeChanges[i]

                        storageOperation.label = formatStorageOperationLabel(
                            i + 1,
                            storageNodeChanges.length,
                        )

                        if (i !== 0) {
                            // Already notifying above.
                            refresh()
                        }

                        client = await getTransactionalClient()

                        await checkBalance()

                        if (enabled) {
                            await client.addStreamToStorageNode(stream.id, address)
                        } else {
                            await client.removeStreamFromStorageNode(stream.id, address)
                        }

                        setDraft(draftId, (draft) => {
                            const node = draft.storageNodes[address]

                            if (node) {
                                node.enabled = enabled

                                node.persistedEnabled = enabled
                            }
                        })
                    }
                })
            } finally {
                setDraft(draftId, (draft) => {
                    draft.persisting = false
                })

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

                    cache.bits = pa.permissions.reduce(
                        (memo, permission) => memo | Bits[permission],
                        cache.bits || 0,
                    )

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

                Object.entries(state.permissions).forEach(
                    ([account, { bits = null, persistedBits = null } = {}]) => {
                        if (bits === persistedBits || (!bits && !persistedBits)) {
                            return
                        }

                        const permissions: StreamPermission[] = !bits
                            ? []
                            : (Object.keys(Bits).filter((perm) =>
                                  matchBits(Bits[perm], bits),
                              ) as StreamPermission[])

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
                    },
                )

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

        abandon(draftId) {
            set((store) =>
                produce(store, ({ cache }) => {
                    const draft = cache[draftId]

                    if (!draft) {
                        return
                    }

                    draft.abandoned = true
                }),
            )

            if (!isPersisting(draftId)) {
                get().teardown(draftId)
            }
        },

        teardown(draftId, { onlyAbandoned = false } = {}) {
            set((store) =>
                produce(store, ({ streamDraftMapping, cache }) => {
                    const draft = cache[draftId]

                    if (!draft) {
                        return
                    }

                    if (!onlyAbandoned || draft.abandoned) {
                        const streamId = draft.streamId || draft.transientStreamId

                        if (streamId) {
                            delete streamDraftMapping[streamId]
                        }

                        delete cache[draftId]
                    }
                }),
            )
        },

        reset() {
            set((store) =>
                produce(store, (current) => ({
                    ...current,
                    ...initialState,
                })),
            )
        },
    }
})

function useRecyclableDraftId(streamId: string | undefined) {
    return useStreamEditorStore(({ streamDraftMapping }) =>
        streamId ? streamDraftMapping[streamId] : undefined,
    )
}

export function useInitStreamDraft(streamId: string | undefined) {
    const recycledDraftId = useRecyclableDraftId(streamId)

    const draftId = useMemo(() => {
        return recycledDraftId || uniqueId('draft-')
        /**
         * We give each new stream id a new draft id (unless we recycle), thus we've gotta
         * disable react-hooks/exhaustive-deps for the next line (`streamId` may seem redundant).
         */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streamId, recycledDraftId])

    const { init, abandon } = useStreamEditorStore(({ init, abandon }) => ({
        init,
        abandon,
    }))

    const client = useClient()

    useEffect(() => {
        if (!client) {
            return () => void 0
        }

        init(draftId, streamId, client)
    }, [draftId, init, client, streamId])

    useEffect(() => () => void abandon(draftId), [draftId, abandon])

    return draftId
}

export function useResetDraftStore() {
    const { reset } = useStreamEditorStore(({ reset }) => ({
        reset,
    }))
    return reset
}

export const StreamDraftContext = createContext<string | undefined>(undefined)

export function useDraftId() {
    return useContext(StreamDraftContext)
}

export function useCurrentDraft() {
    const draftId = useDraftId()

    const cache =
        useStreamEditorStore(({ cache }) => (draftId ? cache[draftId] : undefined)) ||
        initialDraft

    return cache
}

export function useIsCurrentDraftClean() {
    const { metadataChanged, permissionAssignments, storageNodes, transientStreamId } =
        useCurrentDraft()

    return (
        !transientStreamId &&
        !metadataChanged &&
        !permissionAssignments.length &&
        !Object.values(storageNodes).some(
            ({
                enabled = false,
                persistedEnabled = false,
            }: Partial<StorageNodeManifest> = {}) => !enabled !== !persistedEnabled,
        )
    )
}

export function useIsCurrentDraftBusy() {
    const { fetchingStream, persisting, fetchingPermissions, fetchingStorageNodes } =
        useCurrentDraft()

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

    const setTransientStreamId = useStreamEditorStore(
        ({ setTransientStreamId }) => setTransientStreamId,
    )

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

    const toggleStorageNode = useStreamEditorStore(
        ({ toggleStorageNode }) => toggleStorageNode,
    )

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

    return useCallback(
        ({
            onCreate,
            onPermissionsChange,
        }: {
            onCreate?: (streamId: string) => void
            onPermissionsChange?: (
                streamId: string,
                assignments: PermissionAssignment[],
            ) => void
        }) => {
            if (!draftId) {
                throw new Error('No draft id')
            }

            return persist(draftId, { onCreate, onPermissionsChange })
        },
        [draftId, persist],
    )
}

export function usePersistingDraftIdsForStream(streamId: string | undefined) {
    return useStreamEditorStore(({ cache }) =>
        streamId
            ? Object.entries(cache)
                  .filter(
                      ([, draft]) =>
                          draft?.persisting &&
                          (draft.streamId === streamId ||
                              draft.transientStreamId === streamId),
                  )
                  .map(([draftId]) => draftId)
            : [],
    )
}

export function useIsPersistingAnyStreamDraft() {
    return useStreamEditorStore(({ cache }) => {
        return Object.values(cache).some((draft) => draft?.persisting)
    })
}

const NewStreamLink = styled(Link)`
    display: block;
    font-size: 14px;

    :hover {
        text-decoration: underline;
    }
`

function getOpenStreamLink(streamId: string) {
    return function OpenStreamLink() {
        const id: string = decodeURIComponent(
            useMatch(routes.streams.overview())?.params['id'] || '',
        )

        if (!streamId || id === streamId) {
            return <></>
        }

        return (
            <NewStreamLink to={routes.streams.overview({ id: streamId })}>
                Open
            </NewStreamLink>
        )
    }
}
