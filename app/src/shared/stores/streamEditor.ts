import type StreamrClient from 'streamr-client'
import { create } from 'zustand'
import produce from 'immer'
import { PermissionAssignment, StreamPermission } from 'streamr-client'
import address0 from '$app/src/utils/address0'

type StreamId = string

type Address = string

interface Actions {
    fetchStorageNodes: (streamId: StreamId, streamrClient: StreamrClient) => Promise<void>
    toggleStorageNode: (streamId: StreamId, address: Address, enabled: boolean) => void
    persist: (streamId: StreamId) => Promise<void>
    fetchPermissions(streamId: StreamId, streamrClient: StreamrClient): Promise<void>
    setPermissions: (streamId: StreamId, account: Address, bits: number | null) => void
}

interface StorageNodeManifest {
    enabled: boolean
    previousEnabled: boolean | null
}

interface Cache {
    persisting: boolean
    storageNodes: undefined | Partial<Record<Address, StorageNodeManifest>>
    permissionAssignments: PermissionAssignment[]
    permissions:
        | undefined
        | Partial<
              Record<
                  Address,
                  {
                      bits: number | null
                      persistedBits: number | null
                  }
              >
          >
}

interface State {
    cache: Partial<Record<StreamId, Cache>>
}

const initialState: State = {
    cache: {},
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

export const useStreamEditorStore = create<Actions & State>((set, get) => {
    function isPersisting(streamId: StreamId) {
        return get().cache[streamId]?.persisting === true
    }

    function setCache(streamId: StreamId, update: (partial: Cache) => void) {
        set((state) =>
            produce(state, (draft) => {
                const cache = draft.cache[streamId] || {
                    persisting: false,
                    storageNodes: undefined,
                    permissions: undefined,
                    permissionAssignments: [],
                }

                update(cache)

                draft.cache[streamId] = cache
            }),
        )
    }

    return {
        ...initialState,

        async fetchStorageNodes(streamId: StreamId, streamrClient: StreamrClient) {
            if (isPersisting(streamId)) {
                return
            }

            const storageNodes = await streamrClient.getStorageNodes(streamId)

            const result: Cache['storageNodes'] = {}

            storageNodes.forEach((address) => {
                result[address.toLowerCase()] = {
                    enabled: true,
                    previousEnabled: true,
                }
            })

            setCache(streamId, (cache) => {
                cache.storageNodes = result
            })
        },

        toggleStorageNode(streamId: StreamId, address: Address, enabled: boolean) {
            if (isPersisting(streamId)) {
                return
            }

            const addr = address.toLowerCase()

            setCache(streamId, (cache) => {
                if (!cache.storageNodes) {
                    // Noop. Load storage nodes first.
                    return
                }

                const node = cache.storageNodes[addr]

                if (node?.enabled === enabled) {
                    // Nothing to do.
                    return
                }

                if (node && typeof node.previousEnabled === null && !enabled) {
                    // Abandon local mods.
                    return void delete cache.storageNodes[addr]
                }

                if (node) {
                    return void (node.enabled = enabled)
                }

                if (!enabled) {
                    // No `node` and we're disabling? Do nothing.
                    return
                }

                cache.storageNodes[addr] = {
                    enabled,
                    previousEnabled: null,
                }
            })
        },

        async persist(streamId: StreamId) {
            if (isPersisting(streamId)) {
                return
            }

            // Save it!
        },

        async fetchPermissions(streamId: StreamId, streamrClient: StreamrClient) {
            if (isPersisting(streamId)) {
                return
            }

            const permissions = await streamrClient.getPermissions(streamId)

            const result: Cache['permissions'] = {}

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

            setCache(streamId, (draft) => {
                draft.permissions = result
            })
        },

        setPermissions(streamId, account, bits) {
            if (isPersisting(streamId)) {
                return
            }

            setCache(streamId, (draft) => {
                if (!draft.permissions) {
                    // Noop. Load permissions first.
                    return
                }

                const addr = account.toLowerCase()

                const entry = draft.permissions[addr] || {
                    bits: null,
                    persistedBits: null,
                }

                entry.bits = bits

                draft.permissions[addr] = entry

                const assignments: PermissionAssignment[] = []

                Object.entries(draft.permissions).forEach(([account, { bits = null, persistedBits = null } = {}]) => {
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

                draft.permissionAssignments = assignments
            })
        },
    }
})

export function useWillUpdateStorage(streamId: StreamId) {
    return useStreamEditorStore(({ cache: { [streamId]: cache } }) =>
        Object.values(cache?.storageNodes || {}).some((c) => c?.enabled !== c?.previousEnabled),
    )
}