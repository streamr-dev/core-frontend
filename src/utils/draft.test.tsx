import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React, { ReactNode, useEffect, useRef } from 'react'
import { defer } from 'toasterhea'
import { createDraftStore, getEmptyDraft } from './draft'

describe('createDraftStore', () => {
    interface E {
        id: string | undefined
        chainId: number
    }

    let TestDraft: undefined | ReturnType<typeof createDraftStore<E>>

    beforeEach(() => {
        /**
         * Let's work with a simple testing draft.
         */
        TestDraft = createDraftStore<E>({
            getEmptyDraft: () => getEmptyDraft<E>(undefined),

            prefix: 'TestDraft-',
        })
    })

    afterEach(cleanup)

    interface TestComponentProps {
        entity?: E | undefined
        onDraftId?(draftId: string): void
        children?: ReactNode
    }

    function EntityAssigner(props: Omit<TestComponentProps, 'children'>) {
        const { entity, onDraftId } = props

        const Draft = TestDraft!

        const { assign } = Draft.useDraftStore()

        const draftId = Draft.useDraftId()

        const initialized = Draft.useDraft()?.initialized || false

        const onDraftIdRef = useRef(onDraftId)

        if (onDraftIdRef.current !== onDraftId) {
            onDraftIdRef.current = onDraftId
        }

        useEffect(
            function assignEntityToDraft() {
                if (!initialized) {
                    return
                }

                assign(draftId, entity)

                onDraftIdRef.current?.(draftId)
            },
            [assign, draftId, initialized, entity],
        )

        return null
    }

    function TestComponent({ entity, onDraftId, children }: TestComponentProps) {
        const Draft = TestDraft!

        const draftId = Draft.useInitDraft(entity?.id)

        return (
            <Draft.DraftContext.Provider value={draftId}>
                <EntityAssigner entity={entity} onDraftId={onDraftId} />
                {children}
            </Draft.DraftContext.Provider>
        )
    }

    describe('useInitDraft', () => {
        it('restores/reinits existing draft if the entity id has not changed between rerenders', () => {
            let draftId0: string | undefined

            const { rerender } = render(
                <TestComponent
                    entity={{ id: undefined, chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            expect(draftId0).toMatch(/^TestDraft-\d+$/)

            let previousDraftId = draftId0

            rerender(
                <TestComponent
                    entity={{ id: undefined, chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            /**
             * The rerendering of the hook we performed above uses the
             * same entity id thus `draftId` does not change.
             */
            expect(draftId0).toEqual(previousDraftId)

            rerender(
                <TestComponent
                    entity={{ id: 'ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            /**
             * Different entity id = different draft id.
             */
            expect(draftId0).not.toEqual(previousDraftId)

            expect(draftId0).toMatch(/^TestDraft-\d+$/)

            previousDraftId = draftId0

            rerender(
                <TestComponent
                    entity={{ id: 'ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            expect(draftId0).toEqual(previousDraftId)
        })

        it('drops abandoned drafts', () => {
            let draftId0: string | undefined

            const { rerender, unmount } = render(
                <TestComponent
                    entity={{ id: 'ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            expect(draftId0).toMatch(/^TestDraft-/)

            /**
             * Check if a draft for the above id exists. It should.
             */
            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([draftId0])

            let draftId1: string | undefined

            rerender(
                <TestComponent
                    entity={{ id: 'DIFFERENT_ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId1 = draftId
                    }}
                />,
            )

            expect(draftId1).toMatch(/^TestDraft-/)

            expect(draftId0).not.toEqual(draftId1)

            /**
             * First draft got dropped out because we rerendered the component
             * using a different entity. New draft exists.
             */
            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([draftId1])

            unmount()

            /**
             * Finally we unmount the component and the latter draft gets
             * dropped out as well.
             */
            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([])
        })

        it('does not immediately drops abandoned drafts that are being persisted', async () => {
            const waiter = defer()

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft!.usePersist(async () => {
                            /**
                             * The following keeps the persisting process alive as long
                             * as the `waiter.promise` waits for settlement. We later
                             * settle it with `waiter.resolve()` from the outside.
                             */
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            let draftId0: string | undefined

            const { unmount, getByText } = render(
                <TestComponent
                    entity={{ id: 'ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                >
                    <Persistance />
                </TestComponent>,
            )

            expect(draftId0).toMatch(/^TestDraft-/)

            fireEvent.click(getByText(/submit/i))

            await waitFor(
                () => !!TestDraft!.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * Unmount while draft is being persisted.
             */
            unmount()

            /**
             * Even though the draft is now detached (`useInitDraft` got unmounted) we keep
             * the draft in memory because it's being persisted.
             */
            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([draftId0])

            setTimeout(() => {
                waiter.resolve()
            })

            await waiter.promise

            await waitFor(
                () => !TestDraft!.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * We're no longer persisting the draft thus the script auto-cleans it after
             * persistance is settled.
             */

            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([])
        })

        it('is able to un-abandon abandoned drafts they are being persisted', async () => {
            const waiter = defer()

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft!.usePersist(async () => {
                            /**
                             * The following keeps the persisting process alive as long
                             * as the `waiter.promise` waits for settlement. We later
                             * settle it with `waiter.resolve()` from the outside.
                             */
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            let draftId0: string | undefined

            const { unmount: unmount0, getByText } = render(
                <TestComponent
                    entity={{ id: 'ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                >
                    <Persistance />
                </TestComponent>,
            )

            expect(draftId0).toMatch(/^TestDraft-/)

            fireEvent.click(getByText(/submit/i))

            await waitFor(
                () => !!TestDraft!.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * Unmount while draft is being persisted.
             */
            unmount0()

            /**
             * Unmount = abandon.
             */
            await waitFor(
                () => !!TestDraft!.useStore.getState().drafts[draftId0!]?.abandoned,
            )

            /**
             * Even though the draft is now detached (useInitDraft got unmounted) we keep
             * the draft in memory because it's being persisted.
             */
            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([draftId0])

            let draftId1: string | undefined

            const { unmount: unmount1 } = render(
                <TestComponent
                    entity={{ id: 'ID', chainId: 1 }}
                    onDraftId={(draftId) => {
                        draftId1 = draftId
                    }}
                >
                    <Persistance />
                </TestComponent>,
            )

            /**
             * Good sign. We're back on track.
             */
            expect(draftId1).toEqual(draftId0)

            /**
             * Re-mount = de-abandon.
             */
            await waitFor(
                () => !TestDraft!.useStore.getState().drafts[draftId0!]?.abandoned,
            )

            setTimeout(() => {
                waiter.resolve()
            })

            await waiter.promise

            await waitFor(
                () => !TestDraft!.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * We're no longer persisting the draft but it's got de-abandoned thus
             * it's still in the store.
             */
            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([draftId0])

            unmount1()

            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toEqual([])
        })
    })

    describe('useEntity', () => {
        it('gives undefined for drafts initialized with undefined', () => {
            let entity: E | undefined | null = null

            function Inner() {
                entity = TestDraft!.useEntity()

                return null
            }

            render(
                <TestComponent entity={undefined}>
                    <Inner />
                </TestComponent>,
            )

            expect(entity).toBeUndefined()
        })

        it('gives cold copy of the entity by default', () => {
            const entity = { id: 'ID', chainId: 1 }

            let coldEntity: E | undefined

            let hotEntity: E | undefined

            function Inner() {
                coldEntity = TestDraft!.useEntity()

                hotEntity = TestDraft!.useEntity({ hot: true })

                return null
            }

            render(
                <TestComponent entity={entity}>
                    <Inner />
                </TestComponent>,
            )

            expect(coldEntity).toBe(entity)

            expect(hotEntity).toBe(entity)
        })
    })

    describe('useUpdateEntity', () => {
        it('allows to update both cold and hot copies separately (and changes dirtyness)', () => {
            const entity = { id: 'ID', chainId: 1 }

            let hotEntity: E | undefined

            let coldEntity: E | undefined

            function Inner({ updater }: { updater: (hot: E, cold: E) => void }) {
                const update = TestDraft!.useUpdateEntity()

                coldEntity = TestDraft!.useEntity()

                hotEntity = TestDraft!.useEntity({ hot: true })

                return (
                    <button
                        type="button"
                        onClick={() => {
                            update(updater)
                        }}
                    >
                        Update
                    </button>
                )
            }

            let draftId: string | undefined

            const { rerender, getByText } = render(
                <TestComponent
                    entity={entity}
                    onDraftId={(id) => {
                        draftId = id
                    }}
                >
                    <Inner
                        updater={(hot, cold) => {
                            hot.chainId = 6

                            cold.chainId = 7
                        }}
                    />
                </TestComponent>,
            )

            expect(draftId).toMatch(/TestDraft-/)

            expect(TestDraft!.useStore.getState().drafts[draftId!]?.dirty).toBe(false)

            fireEvent.click(getByText(/update/i))

            expect(TestDraft!.useStore.getState().drafts[draftId!]?.dirty).toBe(true)

            expect(hotEntity?.chainId).toEqual(6)

            expect(coldEntity?.chainId).toEqual(7)

            rerender(
                <TestComponent
                    entity={entity}
                    onDraftId={(id) => {
                        draftId = id
                    }}
                >
                    <Inner
                        updater={(hot, cold) => {
                            hot.chainId = 137

                            cold.chainId = 137
                        }}
                    />
                </TestComponent>,
            )

            expect(TestDraft!.useStore.getState().drafts[draftId!]?.dirty).toBe(true)

            expect(hotEntity?.chainId).toEqual(6)

            expect(coldEntity?.chainId).toEqual(7)

            fireEvent.click(getByText(/update/i))

            expect(TestDraft!.useStore.getState().drafts[draftId!]?.dirty).toBe(false)

            expect(hotEntity?.chainId).toEqual(137)

            expect(coldEntity?.chainId).toEqual(137)
        })
    })

    describe('usePersist', () => {
        it('raises the `persisting` flag on a draft for the duration of the persisting (success)', async () => {
            const waiter = defer()

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft!.usePersist(async () => {
                            /**
                             * The following keeps the persisting process alive as long
                             * as the `waiter.promise` waits for settlement. We later
                             * settle it with `waiter.resolve()` from the outside.
                             */
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            const { getByText } = render(
                <TestComponent entity={{ id: 'ID', chainId: 1 }}>
                    <Persistance />
                </TestComponent>,
            )

            fireEvent.click(getByText(/submit/i))

            await waitFor(() =>
                Object.values(TestDraft!.useStore.getState().drafts).some(
                    (d) => d?.persisting,
                ),
            )

            setTimeout(() => {
                waiter.resolve()
            })

            await waiter.promise

            await waitFor(
                () =>
                    !Object.values(TestDraft!.useStore.getState().drafts).some(
                        (d) => d?.persisting,
                    ),
            )
        })

        it('raises the `persisting` flag on a draft for the duration of the persisting (failure)', async () => {
            const waiter = defer()

            function Persistance() {
                const persist = TestDraft!.usePersist(async () => {
                    await waiter.promise
                })

                return (
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await persist()
                            } catch (_) {
                                // Suppress.
                            }
                        }}
                    >
                        Submit
                    </button>
                )
            }

            const { getByText } = render(
                <TestComponent entity={{ id: 'ID', chainId: 1 }}>
                    <Persistance />
                </TestComponent>,
            )

            fireEvent.click(getByText(/submit/i))

            await waitFor(() =>
                Object.values(TestDraft!.useStore.getState().drafts).some(
                    (d) => d?.persisting,
                ),
            )

            setTimeout(() => {
                waiter.reject(new Error('foo'))
            })

            try {
                await waiter.promise
            } catch (_) {
                // Ignore.
            }

            await waitFor(
                () =>
                    !Object.values(TestDraft!.useStore.getState().drafts).some(
                        (d) => d?.persisting,
                    ),
            )
        })

        it('passes `bind` callback so you can bind the entity id and the draft', async () => {
            const waiter = defer()

            const entityId = 'ID'

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft!.usePersist(async (_, { bind }) => {
                            bind(entityId)

                            /**
                             * The following keeps the persisting process alive as long
                             * as the `waiter.promise` waits for settlement. We later
                             * settle it with `waiter.resolve()` from the outside.
                             */
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            let draftId: string | undefined

            /**
             * Render TestComponent using undefined-having entity.
             */
            const { getByText } = render(
                <TestComponent
                    entity={{ id: undefined, chainId: 1 }}
                    onDraftId={(id) => {
                        draftId = id
                    }}
                >
                    <Persistance />
                </TestComponent>,
            )

            expect(draftId).toMatch(/^TestDraft-\d+$/)

            expect(entityId in TestDraft!.useStore.getState().idMap).toBe(false)

            fireEvent.click(getByText(/submit/i))

            await waitFor(() =>
                Object.values(TestDraft!.useStore.getState().drafts).some(
                    (d) => d?.persisting,
                ),
            )

            setTimeout(() => {
                waiter.resolve()
            })

            /**
             * The above click on the Submit button triggered the persisting which
             * in turn binded the draft with `entityId`.
             */
            expect(TestDraft!.useStore.getState().idMap[entityId]).toBe(draftId)

            await waiter.promise

            await waitFor(
                () =>
                    !Object.values(TestDraft!.useStore.getState().drafts).some(
                        (d) => d?.persisting,
                    ),
            )
        })

        it('passes `update` callback so you can alter hot and cold copies of the entity from within the persist callback', async () => {
            const waiter = defer()

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft!.usePersist(async (_, { update }) => {
                            update((hot, cold) => {
                                hot.chainId = 1337

                                cold.chainId = 1337
                            })

                            /**
                             * The following keeps the persisting process alive as long
                             * as the `waiter.promise` waits for settlement. We later
                             * settle it with `waiter.resolve()` from the outside.
                             */
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            let draftId: string | undefined

            const { getByText } = render(
                <TestComponent
                    entity={{ id: undefined, chainId: 1 }}
                    onDraftId={(id) => {
                        draftId = id
                    }}
                >
                    <Persistance />
                </TestComponent>,
            )

            expect(draftId).toMatch(/^TestDraft-\d+$/)

            let { hot, cold } = TestDraft!.useStore.getState().drafts[draftId!]!.entity!

            expect(hot.chainId).toEqual(1)

            expect(cold.chainId).toEqual(1)

            fireEvent.click(getByText(/submit/i))

            await waitFor(() =>
                Object.values(TestDraft!.useStore.getState().drafts).some(
                    (d) => d?.persisting,
                ),
            )

            setTimeout(() => {
                waiter.resolve()
            })

            void ({ hot, cold } =
                TestDraft!.useStore.getState().drafts[draftId!]!.entity!)

            expect(hot.chainId).toEqual(1337)

            expect(cold.chainId).toEqual(1337)

            await waiter.promise

            await waitFor(
                () =>
                    !Object.values(TestDraft!.useStore.getState().drafts).some(
                        (d) => d?.persisting,
                    ),
            )
        })
    })

    describe('useIsAnyDraftBeingPersisted', () => {
        it('detects state correctly', async () => {
            const waiter = defer()

            let isAnyDraftBeingPersisted: boolean | undefined

            function Persistance() {
                isAnyDraftBeingPersisted = TestDraft!.useIsAnyDraftBeingPersisted()

                return (
                    <button
                        type="button"
                        onClick={TestDraft!.usePersist(async () => {
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            /**
             * Start with mounting 2 different instances of TestComponent. Each with
             * a different entity.
             */

            const { getByText } = render(
                <TestComponent entity={{ id: 'ID', chainId: 1 }}>
                    <Persistance />
                </TestComponent>,
            )

            render(<TestComponent entity={{ id: 'OTHER_ID', chainId: 1 }} />)

            expect(Object.keys(TestDraft!.useStore.getState().drafts)).toHaveLength(2)

            fireEvent.click(getByText(/submit/i))

            /**
             * Check if any draft is being persisted. 1 is.
             */
            await waitFor(() =>
                Object.values(TestDraft!.useStore.getState().drafts).some(
                    (d) => d?.persisting,
                ),
            )

            /**
             * Confirm that the hook reflects the reality.
             */
            expect(isAnyDraftBeingPersisted).toBe(true)

            setTimeout(() => {
                waiter.resolve()
            })

            await waiter.promise

            /**
             * Check if any draft is being persisted.
             */
            await waitFor(
                () =>
                    !Object.values(TestDraft!.useStore.getState().drafts).some(
                        (d) => d?.persisting,
                    ),
            )

            /**
             * Confirm that the hook reflects the reality.
             */
            expect(isAnyDraftBeingPersisted).toBe(false)
        })
    })
})
