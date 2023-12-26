import { StreamrConfig } from '@streamr/network-contracts'
import React, { useCallback, useState, useSyncExternalStore } from 'react'
import { useEffect } from 'react'
import { toaster } from 'toasterhea'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { ConfigKey } from '~/types'
import { Layer } from '~/utils/Layer'
import { toBN } from '~/utils/bn'
import { errorToast } from '~/utils/toast'

const infoToast = toaster(Toast, Layer.Toast)

export function useInfoToastEffect() {
    useEffect(() => {
        let timeoutId: number | undefined

        let recentKey: string | undefined

        function onKeyUp() {
            recentKey = undefined

            if (timeoutId) {
                clearTimeout(timeoutId)

                timeoutId = undefined
            }
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === recentKey) {
                return
            }

            onKeyUp()

            recentKey = e.key

            if (e.key !== 'i') {
                return
            }

            timeoutId = window.setTimeout(async () => {
                try {
                    await infoToast.pop({
                        type: ToastType.Info,
                        title: 'Version info',
                        desc: (
                            <ul>
                                <li>Hub v{process.env.HUB_VERSION}</li>
                                <li>Commit hash {process.env.COMMIT_HASH}</li>
                                <li>
                                    StreamrClient v{process.env.STREAMR_CLIENT_VERSION}
                                </li>
                            </ul>
                        ),
                        okLabel: 'Dismiss',
                    })
                } catch (e) {
                    // Ignore.
                }
            }, 1500)
        }

        document.addEventListener('keydown', onKeyDown)

        document.addEventListener('keyup', onKeyUp)

        return () => {
            document.removeEventListener('keydown', onKeyDown)

            document.removeEventListener('keyup', onKeyUp)

            onKeyUp()
        }
    }, [])
}

export function useConfigValueFromChain<
    T extends ConfigKey,
    U extends Awaited<ReturnType<StreamrConfig[T]>>,
>(key: T): U | undefined {
    const [value, setValue] = useState<U>()

    useEffect(() => {
        let mounted = true

        void (async () => {
            try {
                const newValue = await getConfigValueFromChain(key)

                if (!mounted) {
                    return
                }

                setValue(newValue as U)
            } catch (e) {
                console.warn(`Could not load ${key} config from chain`, e)

                errorToast({ title: 'Could not load config from chain' })
            }
        })()

        return () => {
            mounted = false
        }
    }, [key])

    return value
}

export function useMaxUndelegationQueueDays() {
    const maxQueueSeconds = useConfigValueFromChain('maxQueueSeconds')
    const maxQueueDays =
        maxQueueSeconds != null && maxQueueSeconds.gt(0)
            ? maxQueueSeconds.div(60).div(60).div(24)
            : toBN(0)
    return maxQueueDays
}

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (cb: () => void) => {
            const matchMedia = window.matchMedia(query)

            matchMedia.addEventListener('change', cb)

            return () => {
                matchMedia.removeEventListener('change', cb)
            }
        },
        [query],
    )

    return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
