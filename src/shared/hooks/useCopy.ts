import { useState, useCallback, useEffect, useReducer } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { toaster } from 'toasterhea'
import { successToast } from '~/utils/toast'
import Toast from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'

const SUSTAIN_FOR = 3000 // ms

const copyToast = toaster(Toast, Layer.Toast)

export default function useCopy() {
    const [isCopied, setIsCopied] = useState(false)

    const [copiedAt, touch] = useReducer(
        (
            current: number,
            now: number, // Throttle updates to `copiedAt`.
        ) => (current + SUSTAIN_FOR > now ? current : now),
        Number.NEGATIVE_INFINITY,
    )

    const copy = useCallback(
        (
            value: string,
            {
                onAfterCopied,
                toastMessage = 'Copied!',
            }: {
                onAfterCopied?: (value: string) => void
                toastMessage?: string
            } = {},
        ) => {
            copyToClipboard(value)

            onAfterCopied?.(value)

            if (typeof toastMessage === 'string') {
                successToast(
                    {
                        title: toastMessage,
                    },
                    copyToast,
                )
            }

            touch(Date.now())
        },
        [],
    )

    useEffect(() => {
        if (copiedAt < 0) {
            return () => {}
        }

        setIsCopied(true)

        const timeout = setTimeout(() => {
            setIsCopied(false)
        }, SUSTAIN_FOR)

        return () => {
            clearTimeout(timeout)
        }
    }, [copiedAt])

    return {
        copy,
        isCopied,
    }
}
