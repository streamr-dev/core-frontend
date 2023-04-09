import { type UnregisterCallback } from 'history'
import { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

function useBeforeUnload(fn: (e: BeforeUnloadEvent) => void) {
    useEffect(() => {
        window.addEventListener('beforeunload', fn)

        return () => {
            window.removeEventListener('beforeunload', fn)
        }
    }, [fn])
}

export default function usePreventNavigatingAway(message: string, isDirty: () => boolean) {
    const history = useHistory()

    useEffect(() => {
        let unblock: UnregisterCallback | undefined

        if (isDirty()) {
            unblock = history.block(message)
        }

        return () => {
            unblock?.()
        }
    }, [history, isDirty, message])

    useBeforeUnload(
        useCallback(
            (e) => {
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
