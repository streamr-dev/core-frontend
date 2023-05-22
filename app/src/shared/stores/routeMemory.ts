/**
 * Route memory is a string-to-string map that gets erased on every `PUSH`
 * action called on the `history` object.
 *
 * By design you can instruct the erasing mechanism to omit selected keys.
 * This will effectively make the memorized keys and values transfer to the
 * new location where they can either be kept again (see `useKeep`)
 * or erased on the next route change.
 */

import { produce } from 'immer'
import { useEffect } from 'react'
import { create } from 'zustand'
import { useHistory } from 'react-router-dom'

export const RouteMemoryKey = {
    lastStreamListingSelection() {
        return JSON.stringify(['lastStreamListingSelection'])
    },
}

interface Store {
    remember: (key: string, value: string, options?: { keep?: boolean }) => void
    wipe: () => void
    keep: (key: string) => void
    items: Partial<
        Record<
            string,
            {
                keep: boolean
                value: string
            }
        >
    >
}

const useRouteMemoryStore = create<Store>((set, get) => {
    return {
        items: {},

        remember(key, value, { keep = true } = {}) {
            set((current) =>
                produce(current, (draft) => {
                    if (value == null) {
                        return void delete draft.items[key]
                    }

                    draft.items[key] = {
                        keep,
                        value,
                    }
                }),
            )
        },

        wipe() {
            set((current) =>
                produce(current, (draft) => {
                    for (const key in draft.items) {
                        const item = draft.items[key]

                        if (item == null || !Object.prototype.hasOwnProperty.call(draft.items, key)) {
                            continue
                        }

                        if (item.keep) {
                            item.keep = false
                            continue
                        }

                        delete draft.items[key]
                    }
                }),
            )
        },

        keep(key) {
            set((current) =>
                produce(current, (draft) => {
                    const item = draft.items[key]

                    if (item == null || !Object.prototype.hasOwnProperty.call(draft.items, key)) {
                        return
                    }

                    item.keep = true
                }),
            )
        },
    }
})

/**
 * @returns A function that writes a string value at a given key into the current route's memory.
 */
export function useRemember() {
    return useRouteMemoryStore(({ remember }) => remember)
}

/**
 * @param key Key used for route memory lookups.
 * @returns The memorized value.
 */
export function useRecall(key: string) {
    return useRouteMemoryStore(({ items }) => {
        if (!Object.prototype.hasOwnProperty.call(items, key)) {
            return
        }

        return items[key]?.value
    })
}

/**
 * @returns A function that makes the memory wipe mechanism omit
 * given key. It's gonna be available in the new location.
 *
 * If you wanna do a round trip, memorize something on page "A",
 * go to another page, "B", get back to "A" and have the memorized
 * value still available, you'll have to call the returned function
 * on page "B".
 */
export function useKeep() {
    return useRouteMemoryStore(({ keep }) => keep)
}

/**
 * An effect hook that listens for `PUSH` history actions and triggers
 * a route memory wipe.
 */
export function useRouteMemoryWipeEffect() {
    const history = useHistory()

    const { wipe } = useRouteMemoryStore()

    useEffect(() => {
        return history.listen((_, action) => {
            if (action !== 'PUSH') {
                return
            }

            wipe()
        })
    }, [history, wipe])
}
