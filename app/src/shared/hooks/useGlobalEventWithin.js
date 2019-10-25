// @flow

import { useEffect } from 'react'
import { type Ref } from '$shared/flowtype/common-types'

/*
 * useGlobalEventWithin triggers a `callback` with an argument indicating whether the event happened
 * within a given element (ref.current) or not.
 */

export default (eventName: string, ref: Ref<Element>, callback: (boolean) => void, ignoredClassName?: ?string, useCapture?: ?boolean) => {
    useEffect(() => {
        const onEvent = (e: any) => {
            const { current } = ref
            const { target } = e

            if (!current || !(target instanceof Element)) {
                return
            }

            if (ignoredClassName && target.classList.contains(ignoredClassName)) {
                return
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
    }, [useCapture, eventName, ref, callback, ignoredClassName])
}
