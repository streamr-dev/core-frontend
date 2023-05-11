import { create } from 'zustand'
import { useEffect } from 'react'
import produce from 'immer'
import { getProjectPermissions } from '$app/src/getters'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { useProject } from '$shared/stores/projectEditor'
import address0 from "$utils/address0"
import { useWalletAccount } from './wallet'

export enum ProjectPermission {
    Buy,
    Delete,
    Edit,
    Grant,
}

interface Store {
    fetchPermissions: (
        chainId: number,
        projectId: string,
        account: string,
    ) => Promise<void>
    invalidate: (chainId: number, projectId: string, account: string) => void
    permissions: Record<
        string, // [chainId, projectId, account]
        | {
              cache?: number
              value?: {
                  canBuy: boolean
                  canDelete: boolean
                  canEdit: boolean
                  canGrant: boolean
              }
          }
        | undefined
    >
}

function key(chainId: number, projectId: string, account: string) {
    return JSON.stringify([chainId, projectId, account.toLowerCase()])
}

const useProjectAbilitiesStore = create<Store>((set, get) => {
    const fetching: Record<string, boolean | undefined> = {}

    return {
        permissions: {},

        async fetchPermissions(chainId, projectId, account) {
            const pkey = key(chainId, projectId, account)

            const { [pkey]: isFetching = false } = fetching

            if (isFetching) {
                return
            }

            try {
                fetching[pkey] = true

                const permissions = await getProjectPermissions(
                    chainId,
                    projectId,
                    account,
                )

                set((current) =>
                    produce(current, (next) => {
                        const { cache } = next.permissions[pkey] || {}

                        next.permissions[pkey] = {
                            cache,
                            value: permissions,
                        }
                    }),
                )
            } finally {
                delete fetching[pkey]
            }
        },

        invalidate(chainId: number, projectId: string, account: string) {
            set((current) =>
                produce(current, (next) => {
                    const pkay = key(chainId, projectId, account)

                    const { cache = 0 } = next.permissions[pkay] || {}

                    next.permissions[pkay] = {
                        cache: cache + 1,
                    }
                }),
            )
        },
    }
})

export function useProjectAbility(
    chainId: number,
    projectId: string | undefined,
    account: string | undefined,
    permission: ProjectPermission,
) {
    const { fetchPermissions, permissions } = useProjectAbilitiesStore()

    const address = account || address0

    const { value, cache = 0 } = (projectId ? permissions[key(chainId, projectId, address)] : undefined) || {}

    useEffect(() => {
        async function fn() {
            if (!projectId) {
                return
            }

            try {
                await fetchPermissions(chainId, projectId, address)
            } catch (e) {
                console.warn('Could not fetch permissions', chainId, projectId, address, e)
            }
        }

        fn()
    }, [fetchPermissions, chainId, projectId, address, cache])

    switch (permission) {
        case ProjectPermission.Buy:
            return value?.canBuy
        case ProjectPermission.Delete:
            return value?.canDelete
        case ProjectPermission.Edit:
            return value?.canEdit
        case ProjectPermission.Grant:
            return value?.canGrant
        default:
            throw new Error('Invalid permission')
    }
}

export function useCurrentProjectAbility(permission: ProjectPermission) {
    const { chainId } = getCoreConfig().projectRegistry

    const { id } = useProject()

    const address = useWalletAccount()

    return useProjectAbility(chainId, id, address, permission)
}

export function useInvalidateProjectAbilities() {
    return useProjectAbilitiesStore().invalidate
}
