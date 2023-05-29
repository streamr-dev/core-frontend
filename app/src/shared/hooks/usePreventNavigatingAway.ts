import { produce } from 'immer'
import { useEffect, useCallback } from 'react'
import uniqueId from 'lodash/uniqueId'
import { useBeforeUnload } from 'react-router-dom'
import { create } from 'zustand'
import { history } from '~/consts'

type Blocker = {
    message: string
    isDirty: (destination?: string) => boolean
}

interface BlockerStore {
    blockers: Record<string, Blocker | undefined>
    register: (blocker: Blocker) => () => void
}

const useBlockerStore = create<BlockerStore>((set) => {
    return {
        blockers: {},

        register(blocker) {
            const id = uniqueId('blocker-')

            set((current) =>
                produce(current, (next) => {
                    next.blockers[id] = blocker
                }),
            )

            return () => {
                set((current) =>
                    produce(current, (next) => {
                        delete next.blockers[id]
                    }),
                )
            }
        },
    }
})

export default function usePreventNavigatingAway({
    message = 'You have unsaved changes. Are you sure you want to leave?',
    isDirty,
}: {
    message?: string
    isDirty: (destination?: string) => boolean
}) {
    const { register } = useBlockerStore()

    useEffect(() => {
        return register({
            message,
            isDirty,
        })
    }, [register, isDirty, message])

    useBeforeUnload(
        useCallback(
            (e) => {
                /**
                 * Limitations of `history.block` don't apply to the `beforeunload`
                 * events. We can register as many as we want and the browser will
                 * take care of the rest.
                 */
                if (isDirty()) {
                    e.returnValue = message

                    return message
                }

                return ''
            },
            [isDirty, message],
        ),
    )
}

export function useBlockHistoryEffect() {
    const { blockers } = useBlockerStore()

    /**
     * On each change to `blockers` we reblock history using the new set
     * of potential blockers.
     */
    useEffect(() => {
        let unblock: undefined | (() => void) = undefined

        function unblockBeforeUnload() {
            /**
             * We have to make sure our `beforeunload` front-runs history's `beforeunload`.
             * History provides its own handler that's unconditional (always blocks) which
             * in our case does not make sense at all!
             */
            unblock?.()
        }

        window.addEventListener('beforeunload', unblockBeforeUnload)

        unblock = history.block(({ retry, location: { pathname } }) => {
            const blocker = Object.values(blockers).find((blocker) => {
                return blocker?.isDirty(pathname)
            })

            if (!blocker || confirm(blocker.message)) {
                unblock?.()

                retry()
            }
        })

        return () => {
            unblock?.()

            window.removeEventListener('beforeunload', unblockBeforeUnload)
        }
    }, [blockers])
}
