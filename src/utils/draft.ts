import { produce } from 'immer'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { z } from 'zod'
import { create } from 'zustand'
import { DraftValidationError, ValidationError } from '~/errors'
import { isRejectionReason, isTransactionRejection } from '~/utils/exceptions'

interface Entity {
    chainId: number
    id: string | undefined
}

export interface Draft<E extends Entity> {
    abandoned: boolean
    dirty: boolean
    entity:
        | {
              cold: E
              hot: E
          }
        | undefined
    errors: Record<string, string | undefined>
    fetching: boolean
    persisting: boolean
}

export function getEmptyDraft<E extends Entity>(entity: E | undefined): Draft<E> {
    return {
        abandoned: false,
        dirty: false,
        entity: entity && {
            cold: entity,
            hot: entity,
        },
        errors: {},
        fetching: false,
        persisting: false,
    }
}

interface DraftStore<E extends Entity> {
    idMap: Record<string, string>
    drafts: Record<string, Draft<E> | undefined>
    init: (draftId: string) => void
    setErrors: (draftId: string, update: (errors: Draft<E>['errors']) => void) => void
    update: (draftId: string, updater: (hot: E, cold: E) => void) => void
    teardown: (draftId: string, options?: { onlyAbandoned?: boolean }) => void
    abandon: (draftId: string) => void
    persist: (
        draftId: string,
        fn?: (
            draft: Draft<E>,
            options: {
                abortSignal?: AbortSignal
                bind: (id: string) => void
                update: (updater: (hot: E, cold: E) => void) => void
            },
        ) => Promise<void>,
        abortSignal?: AbortSignal,
    ) => Promise<void>
    assign: (draftId: string, entity: E | undefined | null) => void
    validate: (draftId: string, validator: (entity: E) => void) => Draft<E>['errors']
}

interface CreateDraftStoreOptions<E extends Entity = Entity> {
    getEmptyDraft: () => Draft<E>
    isEqual?: (hot: E, cold: E) => boolean
    persist?: (draft: Draft<E>) => void | Promise<void>
    prefix?: string
}

export function createDraftStore<E extends Entity = Entity>(
    options: CreateDraftStoreOptions<E>,
) {
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

        const update: DraftStore<E>['update'] = (draftId, updater) => {
            setDraft(draftId, (draft) => {
                if (!draft.entity) {
                    return
                }

                updater(draft.entity.hot, draft.entity.cold)

                draft.dirty = !(options.isEqual || isEqual)(
                    draft.entity.hot,
                    draft.entity.cold,
                )
            })
        }

        return {
            idMap: {},

            drafts: {},

            init(draftId) {
                /**
                 * Retrieve or create a draft associated with the given draft id.
                 */
                setDraft(
                    draftId,
                    (draft) => {
                        draft.abandoned = false

                        draft.fetching = true
                    },
                    {
                        force: true,
                    },
                )
            },

            assign(draftId, entity) {
                setDraft(draftId, (draft) => {
                    draft.entity = entity ? { cold: entity, hot: entity } : undefined

                    draft.fetching = typeof entity === 'undefined'
                })
            },

            setErrors(draftId, update) {
                setDraft(draftId, (draft) => {
                    update(draft.errors)
                })
            },

            update,

            teardown(draftId, { onlyAbandoned = false } = {}) {
                set((store) =>
                    produce(store, ({ idMap, drafts }) => {
                        const draft = drafts[draftId]

                        if (!draft) {
                            return
                        }

                        const { id } = draft.entity?.cold || {}

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

            async persist(draftId, fn, abortSignal) {
                if (isPersisting(draftId)) {
                    return
                }

                try {
                    setDraft(draftId, (draft) => {
                        draft.persisting = true
                    })

                    set((store) =>
                        produce(store, ({ drafts, idMap }) => {
                            const { id } = drafts[draftId]?.entity?.cold || {}

                            if (id) {
                                idMap[id] = draftId
                            }
                        }),
                    )

                    try {
                        const draft = get().drafts[draftId]

                        if (!draft) {
                            throw new Error(`Draft ${draftId} does not exist`)
                        }

                        await fn?.(draft, {
                            abortSignal,
                            bind: (id) => {
                                set((store) =>
                                    produce(store, (d) => {
                                        d.idMap[id] = draftId
                                    }),
                                )
                            },
                            update: (updater) => {
                                update(draftId, updater)
                            },
                        })

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

                            throw new ValidationError(
                                e.issues.map(({ message }) => message),
                            )
                        }

                        if (e instanceof DraftValidationError) {
                            throw new ValidationError([e.message])
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

            validate(draftId, validator) {
                const entity = get().drafts[draftId]?.entity?.hot

                const errors: Draft<E>['errors'] = {}

                try {
                    if (entity) {
                        validator(entity)
                    }
                } catch (e) {
                    if (e instanceof z.ZodError) {
                        e.issues.forEach(({ path, message }) => {
                            errors[path.join('.')] = message
                        })
                    } else {
                        console.warn('Failed to validate draft', e)
                    }
                }

                return errors
            },
        }
    })

    function useInitDraft(entity: E | undefined | null): string {
        const { idMap, init, abandon, assign } = useDraftStore()

        const { id: entityId } = entity || {}

        const recycledDraftId = entityId ? idMap[entityId] : undefined

        const draftId = useId(
            () => recycledDraftId || DefaultIdGenerator(options.prefix),
            [entityId, recycledDraftId],
        )

        useEffect(
            function initDraft() {
                init(draftId)
            },
            [init, draftId],
        )

        useEffect(
            function abandonDraft() {
                return () => {
                    abandon(draftId)
                }
            },
            [abandon, draftId],
        )

        useEffect(
            function assignEntity() {
                assign(draftId, entity)
            },
            [assign, draftId, entity],
        )

        return draftId
    }

    const useStore = useDraftStore

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
        return useDraft()?.entity?.[hot ? 'hot' : 'cold']
    }

    function useIsDraftClean() {
        return !useDraft()?.dirty
    }

    function useUpdateEntity() {
        const draftId = useDraftId()

        const { update } = useDraftStore()

        return useCallback(
            (updater: (hot: E, cold: E) => void) => {
                if (!draftId) {
                    return
                }

                return update(draftId, updater)
            },
            [draftId, update],
        )
    }

    function useValidateEntity(validator: (entity: E) => void) {
        const draftId = useDraftId()

        const { validate } = useDraftStore()

        const validatorRef = useRef(validator)

        if (validatorRef.current !== validator) {
            validatorRef.current = validator
        }

        return useCallback(() => {
            if (!draftId) {
                return {}
            }

            return validate(draftId, validatorRef.current)
        }, [draftId, validate])
    }

    function useIsFetchingEntity() {
        return !!useDraft()?.fetching
    }

    function useIsDraftBusy() {
        const { fetching = false, persisting = false } = useDraft() || {}

        return fetching || persisting
    }

    function usePersist(
        fn?: (
            draft: Draft<E>,
            options: {
                abortSignal?: AbortSignal
                bind: (id: string) => void
                update: (updater: (hot: E, cold: E) => void) => void
            },
        ) => Promise<void>,
    ) {
        const { persist } = useDraftStore()

        const draftId = useDraftId()

        const abortControllerRef = useRef<AbortController>()

        useEffect(() => {
            const abortController = new AbortController()

            abortControllerRef.current = abortController

            return () => {
                abortController.abort()
            }
        }, [])

        const fnRef = useRef(fn)

        if (fnRef.current !== fn) {
            fnRef.current = fn
        }

        return useCallback(async () => {
            if (!draftId) {
                return
            }

            return persist(draftId, fnRef.current, abortControllerRef.current?.signal)
        }, [persist, draftId])
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

    function useIsAnyDraftBeingPersisted() {
        return Object.values(useDraftStore().drafts).some((d) => d?.persisting)
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
        useIsAnyDraftBeingPersisted,
        useIsDraftBusy,
        useIsDraftClean,
        useIsFetchingEntity,
        usePersist,
        usePersistCallback,
        useSetDraftErrors,
        useStore,
        useUpdateEntity,
        useValidateEntity,
    }
}

function DefaultIdGenerator(prefix = 'EntityDraft-') {
    return uniqueId(prefix)
}

function useId(generator: () => string, deps: unknown[]) {
    const generatorRef = useRef(generator)

    if (generatorRef.current !== generator) {
        generatorRef.current = generator
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => generatorRef.current(), deps)
}
