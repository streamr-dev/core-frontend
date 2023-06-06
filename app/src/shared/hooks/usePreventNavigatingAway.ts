import { produce } from 'immer'
import { useEffect, useCallback, useReducer } from 'react'
import uniqueId from 'lodash/uniqueId'
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

function useBeforeUnload(
    callback: (event: BeforeUnloadEvent) => any,
    options?: { capture?: boolean },
): void {
    const { capture } = options || {}

    useEffect(() => {
        const opts = capture != null ? { capture } : undefined

        window.addEventListener('hub_beforeunload', callback, opts)

        return () => {
            window.removeEventListener('hub_beforeunload', callback, opts)
        }
    }, [callback, capture])
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

function patchBeforeUnload() {
    /**
     * `history` forces in its own `beforeunload` event handler which makes the user
     * always having to confirm a leave. Here we disable it the hackiest if ways.
     *
     * We overwrite `Window#addEventListener` and `Window#removeEventListener` to make
     * them ignore "unauthorized" `beforeunload` and introduce `hub_beforeunload` event,
     * and let that through.
     *
     * This effectively disables all library-driven logic for that event. It also enforces
     * us to use the new event internally, too. Win some. Lose some.
     */

    if (window.addEventListener !== Window.prototype.addEventListener) {
        return
    }

    function addEventListener(type: any, ...rest: [any, any]) {
        if (type === 'beforeunload') {
            return
        }

        Window.prototype.addEventListener.call(window, type.replace(/^hub_/, ''), ...rest)
    }

    window.addEventListener = addEventListener

    function removeEventListener(type: any, ...rest: [any, any]) {
        if (type === 'beforeunload') {
            return
        }

        Window.prototype.removeEventListener.call(
            window,
            type.replace(/^hub_/, ''),
            ...rest,
        )
    }

    window.removeEventListener = removeEventListener
}

export function useBlockHistoryEffect() {
    const { blockers } = useBlockerStore()

    const [cache, bump] = useReducer((x) => x + 1, 0)

    /**
     * On each change to `blockers` we reblock history using the new set
     * of potential blockers.
     */
    useEffect(() => {
        patchBeforeUnload()

        const unblock = history.block(({ retry, location: { pathname } }) => {
            const blocker = Object.values(blockers).find((blocker) => {
                return blocker?.isDirty(pathname)
            })

            if (!blocker || confirm(blocker.message)) {
                unblock()

                retry()
            }

            /**
             * This callback runs on every attempt to change the client-side routing. It's
             * ditched on every try thus we have to re-engage it manually.
             */
            bump()
        })

        cache // keep

        return unblock
    }, [blockers, cache])
}
