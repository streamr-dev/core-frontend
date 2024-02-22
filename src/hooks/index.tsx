import { StreamrConfig } from '@streamr/network-contracts'
import { UseQueryResult } from '@tanstack/react-query'
import React, { useCallback, useState, useSyncExternalStore } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { BehindIndexError } from '~/errors/BehindIndexError'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import { useCurrentChainId } from '~/shared/stores/chain'
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

    const chainId = useCurrentChainId()

    useEffect(() => {
        let mounted = true

        void (async () => {
            try {
                const newValue = await getConfigValueFromChain(chainId, key)

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
    }, [key, chainId])

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
            if (typeof window.matchMedia !== 'function') {
                return () => {}
            }

            const matchMedia = window.matchMedia(query)

            matchMedia.addEventListener('change', cb)

            return () => {
                matchMedia.removeEventListener('change', cb)
            }
        },
        [query],
    )

    return useSyncExternalStore(
        subscribe,
        () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
    )
}

export function useRequestedBlockNumber(): number {
    const blockNumber = useSearchParams()[0].get('b')

    try {
        return z.coerce.number().min(0).parse(blockNumber)
    } catch (_) {
        return 0
    }
}

export function useLastBehindBlockError<T extends UseQueryResult>(
    query: T,
): BehindIndexError | null {
    const { error, isSuccess } = query

    const [lastError, setLastError] = useState(
        error instanceof BehindIndexError ? error : null,
    )

    useEffect(
        function setTruthyLastError() {
            if (error instanceof BehindIndexError) {
                setLastError(error)
            }
        },
        [error],
    )

    useEffect(
        function resetLastErrorOnSuccess() {
            if (isSuccess) {
                setLastError(null)
            }
        },
        [isSuccess],
    )

    return lastError
}
