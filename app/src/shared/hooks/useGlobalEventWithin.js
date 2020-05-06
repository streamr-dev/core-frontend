// @flow

import { useEffect } from 'react'

/*
 * useGlobalEventWithin triggers a `callback` with an argument indicating whether the event happened
 * within a given element (ref.current) or not.
 */

export default (eventName: string, ref: any, callback: (boolean) => void, ignoredWithin?: any, useCapture?: ?boolean) => {
    useEffect(() => {
        const onEvent = (e: any) => {
            const { current } = ref
            const { target } = e

            if (!current || !(target instanceof Element)) {
                return
            }

            if (typeof ignoredWithin === 'string' && ignoredWithin && target.classList.contains(ignoredWithin)) {
                return
            }

            if (typeof ignoredWithin === 'object' && ignoredWithin && ignoredWithin.current) {
                if (ignoredWithin.current === target || ignoredWithin.current.contains(target)) {
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
    }, [useCapture, eventName, ref, callback, ignoredWithin])
}
