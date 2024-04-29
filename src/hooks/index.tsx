import { StreamrConfig } from 'network-contracts-ethers6'
import { UseQueryResult } from '@tanstack/react-query'
import React, { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { BehindIndexError } from '~/errors/BehindIndexError'
import { getConfigValueFromChain } from '~/getters/getConfigValueFromChain'
import { useCurrentChainId } from '~/utils/chains'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { ConfigKey } from '~/types'
import { Layer } from '~/utils/Layer'
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
                                <li>@streamr/sdk v{process.env.STREAMR_SDK_VERSION}</li>
                                <li>
                                    @streamr/config v{process.env.STREAMR_CONFIG_VERSION}
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
        maxQueueSeconds != null && maxQueueSeconds > 0
            ? maxQueueSeconds / 60n / 60n / 24n
            : 0n
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

/**
 * Extracts block number (`?b=…`) from GET params; makes sure it's
 * a number. Defaults to 0.
 */
export function useRequestedBlockNumber(): number {
    const blockNumber = useSearchParams()[0].get('b')

    try {
        return z.coerce.number().min(0).parse(blockNumber)
    } catch (_) {
        return 0
    }
}

/**
 * Tracks and returns a referenace to the latest `BehindIndexError` exception.
 */
export function useLatestBehindBlockError<T extends UseQueryResult>(
    query: T,
): BehindIndexError | null {
    const { error, isSuccess } = query

    const behindBlockErrorRef = useRef<BehindIndexError | null>(null)

    if (error instanceof BehindIndexError) {
        behindBlockErrorRef.current = error
    }

    if (isSuccess) {
        behindBlockErrorRef.current = null
    }

    return behindBlockErrorRef.current
}

/**
 * Keeps a reference of the first encountered `BehindIndexError` within
 * the context of `resetDeps`.
 */
export function useInitialBehindIndexError<T extends UseQueryResult>(
    query: T,
    resetDeps: unknown[],
): BehindIndexError | null {
    const { error } = query

    const errorRef = useRef<BehindIndexError | null>(null)

    const resetKey = JSON.stringify(resetDeps)

    const resetKeyRef = useRef(resetKey)

    if (!errorRef.current && error instanceof BehindIndexError) {
        errorRef.current = error
    }

    if (resetKeyRef.current !== resetKey) {
        resetKeyRef.current = resetKey

        errorRef.current = null
    }

    return errorRef.current
}

/**
 * Refreshes given erroring query after 5s if the reason for its failure
 * is a `BehindIndexError`.
 */
export function useRefetchQueryBehindIndexEffect<T extends UseQueryResult>(
    query: T,
): void {
    const isBehindError = query.error instanceof BehindIndexError

    useEffect(
        function refetchQueryOnBehindBlockError() {
            if (!isBehindError) {
                return
            }

            const timeoutId = setTimeout(() => {
                query.refetch()
            }, 15000)

            return () => {
                clearTimeout(timeoutId)
            }
        },
        [query, isBehindError],
    )
}
