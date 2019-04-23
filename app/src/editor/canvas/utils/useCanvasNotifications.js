import { useCallback, useRef, useEffect } from 'react'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import * as services from '../services'
import { isRunning } from '../state'

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

    useEffect(() => {
        autosave.off('fail', onAutosaveFail)
        autosave.on('fail', onAutosaveFail)
        return () => {
            autosave.off('fail', onAutosaveFail)
        }
    }, [onAutosaveFail, autosave])
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

    const canvasIsRunning = isRunning(canvas)
    const prevIsRunning = useRef(canvasIsRunning)

    useEffect(() => {
        if (canvasIsRunning === prevIsRunning.current) { return }
        prevIsRunning.current = canvasIsRunning
        if (canvasIsRunning) {
            onStart()
        } else {
            onStop()
        }
    }, [canvasIsRunning, prevIsRunning, onStart, onStop])
}

export default function useCanvasNotifications(canvas = {}) {
    useAutosaveNotification(services.autosave, canvas)
    useCanvasRunNotification(canvas)
}
