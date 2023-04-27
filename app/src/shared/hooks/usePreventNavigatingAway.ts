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

export default function usePreventNavigatingAway({
    message = 'You have unsaved changes. Are you sure you want to leave?',
    isDirty,
}: {
    message?: string
    isDirty: (destination?: string) => boolean
}) {
    const history = useHistory()

    useEffect(
        () =>
            history.block(({ pathname }) => {
                if (isDirty(pathname)) {
                    return message
                }
            }),
        [history, isDirty, message],
    )

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
