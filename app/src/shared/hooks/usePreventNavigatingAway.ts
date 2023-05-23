import { produce } from 'immer'
import { useEffect, useCallback } from 'react'
import uniqueId from 'lodash/uniqueId'
import { useHistory } from 'react-router-dom'
import { create } from 'zustand'

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

function useBeforeUnload(fn: (e: BeforeUnloadEvent) => void) {
    useEffect(() => {
        window.addEventListener('beforeunload', fn)

        return () => {
            window.removeEventListener('beforeunload', fn)
        }
    }, [fn])
}

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

    const history = useHistory()

    useEffect(() => {
        /**
         * On each change to `blockers` we reblock history using the new set
         * of potential blockers.
         */
        return history.block(({ pathname }) => {
            const blocker = Object.values(blockers).find((blocker) => {
                return blocker?.isDirty(pathname)
            })

            if (blocker) {
                return blocker.message
            }
        })
    }, [history, blockers])
}
