import { fireEvent, render, waitFor } from '@testing-library/react'
import React, { useMemo } from 'react'
import { defer } from 'toasterhea'
import { createDraftStore, getEmptyDraft } from './draft'

describe('createDraftStore', () => {
    describe('useInitDraft', () => {
        it('restores/reinits existing draft if the entity id has not changed between rerenders', () => {
            interface E {
                id: string | undefined
                chainId: number
            }

            const TestDraft = createDraftStore<E>({
                getEmptyDraft: () =>
                    getEmptyDraft({
                        id: undefined,
                        chainId: 1,
                    }),

                prefix: 'TestDraft-',
            })

            let draftId: string | undefined

            function T({ id }: { id?: string | undefined }) {
                const entity = useMemo(() => ({ id, chainId: 1 }), [id])

                draftId = TestDraft.useInitDraft(entity)

                return null
            }

            const { rerender } = render(<T id={undefined} />)

            expect(draftId).toMatch(/^TestDraft-\d+$/)

            let previousDraftId = draftId

            rerender(<T id={undefined} />)

            expect(draftId).toEqual(previousDraftId)

            rerender(<T id="ID" />)

            expect(draftId).not.toEqual(previousDraftId)

            expect(draftId).toMatch(/^TestDraft-\d+$/)

            previousDraftId = draftId

            rerender(<T id="ID" />)

            expect(draftId).toEqual(previousDraftId)
        })

        it('drops abandoned drafts', () => {
            interface E {
                id: string | undefined
                chainId: number
            }

            const TestDraft = createDraftStore<E>({
                getEmptyDraft: () =>
                    getEmptyDraft({
                        id: undefined,
                        chainId: 1,
                    }),

                prefix: 'TestDraft-',
            })

            interface Props {
                id: string
                onDraftId(draftId: string): void
            }

            function T({ id, onDraftId }: Props) {
                const entity = useMemo(() => ({ id, chainId: 1 }), [id])

                onDraftId(TestDraft.useInitDraft(entity))

                return null
            }

            let draftId0: string | undefined

            const { rerender, unmount } = render(
                <T
                    id="ID"
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            expect(draftId0).toMatch(/^TestDraft-/)

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([draftId0])

            let draftId1: string | undefined

            rerender(
                <T
                    id="DIFFERENT_ID"
                    onDraftId={(draftId) => {
                        draftId1 = draftId
                    }}
                />,
            )

            expect(draftId1).toMatch(/^TestDraft-/)

            expect(draftId0).not.toEqual(draftId1)

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([draftId1])

            unmount()

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([])
        })

        it('does not immediately drops abandoned drafts that are being persisted', async () => {
            interface E {
                id: string | undefined
                chainId: number
            }

            const TestDraft = createDraftStore<E>({
                getEmptyDraft: () =>
                    getEmptyDraft({
                        id: undefined,
                        chainId: 1,
                    }),

                prefix: 'TestDraft-',
            })

            interface Props {
                id: string
                onDraftId(draftId: string): void
            }

            function T({ id, onDraftId }: Props) {
                const entity = useMemo(() => ({ id, chainId: 1 }), [id])

                const draftId = TestDraft.useInitDraft(entity)

                onDraftId(draftId)

                return (
                    <TestDraft.DraftContext.Provider value={draftId}>
                        <Persistance />
                    </TestDraft.DraftContext.Provider>
                )
            }

            const waiter = defer()

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft.usePersist(async (draft, { bind }) => {
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            let draftId0: string | undefined

            const { unmount, getByText } = render(
                <T
                    id="ID"
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            expect(draftId0).toMatch(/^TestDraft-/)

            fireEvent.click(getByText(/submit/i))

            await waitFor(
                () => !!TestDraft.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * Unmount while draft is being persisted.
             */
            unmount()

            /**
             * Even though the draft is now detached (`useInitDraft` got unmounted) we keep
             * the draft in memory because it's being persisted.
             */
            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([draftId0])

            setTimeout(() => {
                waiter.resolve()
            })

            await waiter.promise

            await waitFor(
                () => !TestDraft.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * We're no longer persisting the draft thus the script auto-cleans it after
             * persistance is settled.
             */

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([])
        })

        it('is able to un-abandon abandoned drafts they are being persisted', async () => {
            interface E {
                id: string | undefined
                chainId: number
            }

            const TestDraft = createDraftStore<E>({
                getEmptyDraft: () =>
                    getEmptyDraft({
                        id: undefined,
                        chainId: 1,
                    }),

                prefix: 'TestDraft-',
            })

            interface Props {
                id: string
                onDraftId(draftId: string): void
            }

            function T({ id, onDraftId }: Props) {
                const entity = useMemo(() => ({ id, chainId: 1 }), [id])

                const draftId = TestDraft.useInitDraft(entity)

                onDraftId(draftId)

                return (
                    <TestDraft.DraftContext.Provider value={draftId}>
                        <Persistance />
                    </TestDraft.DraftContext.Provider>
                )
            }

            const waiter = defer()

            function Persistance() {
                return (
                    <button
                        type="button"
                        onClick={TestDraft.usePersist(async (draft, { bind }) => {
                            await waiter.promise
                        })}
                    >
                        Submit
                    </button>
                )
            }

            let draftId0: string | undefined

            const { unmount: unmount0, getByText } = render(
                <T
                    id="ID"
                    onDraftId={(draftId) => {
                        draftId0 = draftId
                    }}
                />,
            )

            expect(draftId0).toMatch(/^TestDraft-/)

            fireEvent.click(getByText(/submit/i))

            await waitFor(
                () => !!TestDraft.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * Unmount while draft is being persisted.
             */

            unmount0()

            /**
             * Unmount = abandon.
             */

            await waitFor(
                () => !!TestDraft.useStore.getState().drafts[draftId0!]?.abandoned,
            )

            /**
             * Even though the draft is now detached (useInitDraft got unmounted) we keep
             * the draft in memory because it's being persisted.
             */

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([draftId0])

            let draftId1: string | undefined

            const { unmount: unmount1 } = render(
                <T
                    id="ID"
                    onDraftId={(draftId) => {
                        draftId1 = draftId
                    }}
                />,
            )

            /**
             * Good sign. We're back on track.
             */

            expect(draftId1).toEqual(draftId0)

            /**
             * Re-mount = de-abandon.
             */

            await waitFor(
                () => !TestDraft.useStore.getState().drafts[draftId0!]?.abandoned,
            )

            setTimeout(() => {
                waiter.resolve()
            })

            await waiter.promise

            await waitFor(
                () => !TestDraft.useStore.getState().drafts[draftId0!]?.persisting,
            )

            /**
             * We're no longer persisting the draft but it's got de-abandoned thus
             * it's still in the store.
             */

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([draftId0])

            unmount1()

            expect(Object.keys(TestDraft.useStore.getState().drafts)).toEqual([])
        })
    })

    describe('useEntity', () => {})

    describe('useUpdateEntity', () => {})

    describe('usePersist', () => {})

    describe('useIsAnyDraftBeingPersisted', () => {})
})
