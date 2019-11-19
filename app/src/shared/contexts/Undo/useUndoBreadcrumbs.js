import { useContext, useLayoutEffect, useRef } from 'react'
import * as Sentry from '@sentry/browser'
import { Context } from './index'

/**
 * Logs changes to undo stack to Sentry.
 * TODO: include state diff.
 */

export default function useUndoBreadcrumbs(enabled) {
    const { pointer, action } = useContext(Context)
    const lastPointerRef = useRef(pointer)
    const isEnabled = !!enabled
    useLayoutEffect(() => {
        if (!isEnabled) { return }
        const wasUndo = pointer < lastPointerRef.current
        lastPointerRef.current = pointer
        const { type } = action
        Sentry.addBreadcrumb({
            category: 'action',
            message: `${type}${wasUndo ? ' (Undo)' : ''}`,
            data: action,
            level: Sentry.Severity.Info,
        })
    }, [action, pointer, isEnabled])
}
