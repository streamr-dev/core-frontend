import React, { useCallback, useRef, useEffect } from 'react'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import * as services from '../services'

import useCanvasStateChangeEffect from './useCanvasStateChangeEffect'

const EMPTY = {}

function useAutosaveNotification(autosave, canvas = EMPTY) {
    const onAutosaveFail = useCallback((error, failedCanvas = {}) => {
        if (failedCanvas.id !== canvas.id) { return }
        Notification.push({
            title: 'Autosave failed.',
            icon: NotificationIcon.ERROR,
            error,
        })
    }, [canvas])

    const lastCallback = useRef(onAutosaveFail)

    useEffect(() => {
        autosave.off('fail', lastCallback.current)
        lastCallback.current = onAutosaveFail
        autosave.on('fail', onAutosaveFail)
        return () => {
            autosave.off('fail', lastCallback.current)
        }
    }, [onAutosaveFail, autosave, lastCallback])
}

function useCanvasRunNotification(canvas = EMPTY) {
    const onStart = useCallback(() => {
        Notification.push({
            title: 'Canvas started.',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [])

    const onStop = useCallback(() => {
        Notification.push({
            title: 'Canvas stopped.',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [])

    useCanvasStateChangeEffect(canvas, useCallback((canvasIsRunning) => {
        if (canvasIsRunning) {
            onStart()
        } else {
            onStop()
        }
    }, [onStart, onStop]))
}

export function pushErrorNotification(error) {
    console.error(error) // eslint-disable-line no-console
    // eslint-disable-next-line react/no-danger
    const title = error.message ? <span dangerouslySetInnerHTML={{ __html: error.message }} /> : 'Error'
    Notification.push({
        title,
        icon: NotificationIcon.ERROR,
        error,
    })
}

export function pushWarningNotification(warning) {
    console.warn(warning) // eslint-disable-line no-console
    Notification.push({
        title: warning.message || 'Warning',
        icon: NotificationIcon.WARNING,
        warning,
    })
}

export function pushInfoNotification(info) {
    console.info(info) // eslint-disable-line no-console
    Notification.push({
        title: info.message || 'Info',
        icon: NotificationIcon.INFO,
        info,
    })
}

export default function useCanvasNotifications(canvas = {}) {
    useAutosaveNotification(services.autosave, canvas)
    useCanvasRunNotification(canvas)
}
