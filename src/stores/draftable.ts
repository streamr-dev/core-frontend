import { produce } from 'immer'
import { create } from 'zustand'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { z } from 'zod'
import { ValidationError } from '~/errors'
import { isTransactionRejection } from '~/utils'
import { isRejectionReason } from '~/modals/BaseModal'

interface Entity {
    id: string | number | undefined
}

export interface Draft<E extends Entity> {
    abandoned: boolean
    dirty: boolean
    entity: {
        cold: E
        hot: E
    }
    errors: Record<string, string | undefined>
    fetching: boolean
    persisting: boolean
}

export function getEmptyDraft<E extends Entity>(entity: E): Draft<E> {
    return {
        abandoned: false,
        dirty: false,
        entity: { cold: entity, hot: entity },
        errors: {},
        fetching: false,
        persisting: false,
    }
}

interface DraftStore<E extends Entity> {
    idMap: Record<string, string>
    drafts: Record<string, Draft<E> | undefined>
    init: (
        draftId: string,
        entityId: string | undefined,
        params?: {
            onInit?: (
                entityId: string | undefined,
                recycled: boolean,
                draft: Draft<E>,
            ) => void
        },
    ) => void
    setErrors: (draftId: string, update: (errors: Draft<E>['errors']) => void) => void
    update: (draftId: string, updater: (entity: E) => void) => void
    teardown: (draftId: string, options?: { onlyAbandoned?: boolean }) => void
    abandon: (draftId: string) => void
    persist: (draftId: string) => Promise<void>
}

export function createDraftStore<E extends Entity = Entity>(options: {
    getEmptyDraft: () => Draft<E>
    fetch: (entityId: string) => Promise<E>
    persist: (draft: Draft<E>) => void | Promise<void>
}) {
    const useDraftStore = create<DraftStore<E>>((set, get) => {
        function isPersisting(draftId: string) {
            return get().drafts[draftId]?.persisting === true
        }

        function setDraft(
            draftId: string,
            update: (draft: Draft<E>) => void,
            { force = false } = {},
        ) {
            set((store) => {
                if (!store.drafts[draftId] && !force) {
                    return store
                }

                return produce(store, ({ drafts }) => {
                    Object.assign(drafts, {
                        [draftId]: produce(
                            store.drafts[draftId] || options.getEmptyDraft(),
                            update,
                        ),
                    })
                })
            })
        }

        return {
            idMap: {},

            drafts: {},

            init(draftId, entityId, params = {}) {
                const recycled = !!get().drafts[draftId]

                setDraft(
                    draftId,
                    (draft) => {
                        const { cold, hot } = draft.entity

                        cold.id = entityId

                        hot.id = entityId

                        draft.abandoned = false

                        params.onInit?.(entityId, recycled, draft)
                    },
                    {
                        force: true,
                    },
                )

                if (!entityId || recycled) {
                    return
                }

                void (async () => {
                    try {
                        setDraft(draftId, (draft) => {
                            draft.fetching = true
                        })

                        const entity = await options.fetch(entityId)

                        setDraft(draftId, (draft) => {
                            draft.entity.hot = entity

                            draft.entity.cold = entity

                            draft.dirty = false
                        })
                    } finally {
                        setDraft(draftId, (draft) => {
                            draft.fetching = false
                        })
                    }
                })()
            },

            setErrors(draftId, update) {
                setDraft(draftId, (draft) => {
                    update(draft.errors)
                })
            },

            update(draftId, updater) {
                setDraft(draftId, (draft) => {
                    updater(draft.entity.hot)

                    draft.dirty = !isEqual(draft.entity.hot, draft.entity.cold)
                })
            },

            teardown(draftId, { onlyAbandoned = false } = {}) {
                set((store) =>
                    produce(store, ({ idMap, drafts }) => {
                        const draft = drafts[draftId]

                        if (!draft) {
                            return
                        }

                        const { id } = draft.entity.cold

                        if (!onlyAbandoned || draft.abandoned) {
                            if (id) {
                                delete idMap[id]
                            }

                            delete drafts[draftId]
                        }
                    }),
                )
            },

            abandon(draftId) {
                setDraft(draftId, (draft) => {
                    draft.abandoned = true
                })

                if (!isPersisting(draftId)) {
                    get().teardown(draftId)
                }
            },

            async persist(draftId) {
                if (isPersisting(draftId)) {
                    return
                }

                try {
                    setDraft(draftId, (draft) => {
                        draft.persisting = true
                    })

                    set((store) =>
                        produce(store, ({ drafts, idMap }) => {
                            const { id } = drafts[draftId]?.entity.cold || {}

                            if (id) {
                                idMap[id] = draftId
                            }
                        }),
                    )

                    const draft = get().drafts[draftId]

                    if (!draft) {
                        throw new Error(`Draft ${draftId} does not exist`)
                    }

                    try {
                        await options.persist?.(draft)
                    } catch (e) {
                        if (e instanceof z.ZodError) {
                            const errors: Draft<E>['errors'] = {}

                            e.issues.forEach(({ path, message }) => {
                                errors[path.join('.')] = message
                            })

                            setDraft(draftId, (copy) => {
                                copy.errors = errors
                            })

                            /**
                             * @TODO: ValidationError seems to be a redundant abstraction we can get rid
                             * of and use ZodError directly.
                             */
                            throw new ValidationError(
                                e.issues.map(({ message }) => message),
                            )
                        }

                        throw e
                    }
                } finally {
                    setDraft(draftId, (draft) => {
                        draft.persisting = false
                    })

                    get().teardown(draftId, { onlyAbandoned: true })
                }
            },
        }
    })

    function useInitDraft(
        entityId: string | undefined,
        onInit?: (
            entityId: string | undefined,
            recycled: boolean,
            draft: Draft<E>,
        ) => void,
    ) {
        const { idMap, init, abandon } = useDraftStore()

        const recycledDraftId = entityId ? idMap[entityId] : undefined

        const draftId = useMemo(() => {
            /**
             * This hook depends on project id just as much as it does on the current recycled draft it.
             * Using it like below satisfies `react-hooks/exhaustive-deps` eslint rule.
             */
            entityId

            return recycledDraftId || uniqueId('EntityDraft-')
        }, [entityId, recycledDraftId])

        const onInitRef = useRef(onInit)

        if (onInitRef.current !== onInit) {
            onInitRef.current = onInit
        }

        useEffect(() => {
            init(draftId, entityId, {
                onInit: onInitRef.current,
            })
        }, [draftId, init, abandon, entityId])

        useEffect(() => () => void abandon(draftId), [draftId, abandon])

        return draftId
    }

    const DraftContext = createContext<string | undefined>(undefined)

    function useDraftId() {
        return useContext(DraftContext)
    }

    function useDraft() {
        const draftId = useDraftId()

        const { drafts } = useDraftStore()

        return draftId ? drafts[draftId] : undefined
    }

    function useEntity({ hot = false } = {}) {
        return useDraft()?.entity[hot ? 'hot' : 'cold']
    }

    function useIsDraftClean() {
        return !useDraft()?.dirty
    }

    function useUpdateEntity() {
        const draftId = useDraftId()

        const { update } = useDraftStore()

        return useCallback(
            (updater: (entity: E) => void) => {
                if (!draftId) {
                    return
                }

                return update(draftId, updater)
            },
            [draftId, update],
        )
    }

    function useIsFetchingEntity() {
        return !!useDraft()?.fetching
    }

    function useIsDraftBusy() {
        const { fetching = false, persisting = false } = useDraft() || {}

        return fetching || persisting
    }

    function usePersistCallback() {
        const { persist } = useDraftStore()

        const draftId = useDraftId()

        const busy = useIsDraftBusy()

        const clean = useIsDraftClean()

        const abortControllerRef = useRef<AbortController>()

        useEffect(() => {
            const abortController = new AbortController()

            abortControllerRef.current = abortController

            return () => {
                abortController.abort()
            }
        }, [])

        return useCallback(
            (
                params: {
                    onDone?: (mounted: boolean) => void
                    onError?: (e: unknown) => void
                } = {},
            ) => {
                if (!draftId || busy || clean) {
                    return
                }

                void (async () => {
                    try {
                        await persist(draftId)

                        const { aborted = false } =
                            abortControllerRef.current?.signal || {}

                        params.onDone?.(!aborted)
                    } catch (e) {
                        if (isTransactionRejection(e)) {
                            return
                        }

                        if (isRejectionReason(e)) {
                            return
                        }

                        params.onError?.(e)
                    }
                })()
            },
            [persist, draftId, busy, clean],
        )
    }

    function useSetDraftErrors() {
        const draftId = useDraftId()

        const { setErrors } = useDraftStore()

        return useCallback(
            (update: (errors: Record<string, string | undefined>) => void) => {
                if (!draftId) {
                    return
                }

                return setErrors(draftId, update)
            },
            [draftId, setErrors],
        )
    }

    return {
        DraftContext,
        useDraft,
        useDraftId,
        useDraftStore,
        useEntity,
        useInitDraft,
        useIsDraftBusy,
        useIsDraftClean,
        useIsFetchingEntity,
        usePersistCallback,
        useSetDraftErrors,
        useUpdateEntity,
    }
}
