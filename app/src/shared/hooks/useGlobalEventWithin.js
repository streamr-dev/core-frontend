// @flow

import { useEffect } from 'react'

/*
 * useGlobalEventWithin triggers a `callback` with an argument indicating whether the event happened
 * within a given element (ref.current) or not.
 */

export default (eventName: string, ref: any, callback: (boolean) => void, ignoreWithin?: any, useCapture?: ?boolean) => {
    useEffect(() => {
        const onEvent = (e: any) => {
            const { current } = ref
            const { target } = e

            if (!current || !(target instanceof Element)) {
                return
            }

            if (typeof ignoreWithin === 'string' && ignoreWithin && target.classList.contains(ignoreWithin)) {
                return
            }

            if (typeof ignoreWithin === 'object' && ignoreWithin && ignoreWithin.current) {
                if (ignoreWithin.current === target || ignoreWithin.current.contains(target)) {
                    return
                }
            }

            callback(current === target || current.contains(target))
        }

        const eventNames = eventName.split(/\s+/)

        eventNames.forEach((name) => {
            window.addEventListener(name, onEvent, useCapture)
        })

        return () => {
            eventNames.forEach((name) => {
                window.removeEventListener(name, onEvent, useCapture)
            })
        }
    }, [useCapture, eventName, ref, callback, ignoreWithin])
}
