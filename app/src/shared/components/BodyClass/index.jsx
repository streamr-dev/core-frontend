// @flow

import { useLayoutEffect } from 'react'

type Props = {
    className: string,
}

export const NO_SCROLL = 'overflow-hidden'
export const PAGE_SECONDARY = 'page-secondary'

// tracks how many times a class is added
// only removes class once no more components reference it
// i.e. counter = 0
const classCounters = {}

function addClass(className) {
    const classNames = className.split(/\s+/)
    classNames.forEach((name) => {
        // increment counter for each name
        classCounters[name] = (classCounters[name] + 1) || 1
    })
    if (!document.body) { return }
    document.body.classList.add(...classNames)
}

function removeClass(className) {
    const classNames = className.split(/\s+/)
    classNames.forEach((name) => {
        // decrement counter for each name
        classCounters[name] = Math.max((classCounters[name] - 1) || 0, 0)
    })

    // find items that no longer have any referencing components
    const toRemove = Object.keys(classCounters).filter((name) => (
        !classCounters[name]
    ))

    toRemove.forEach((name) => {
        delete classCounters[name] // remove from index
    })

    if (document.body) {
        document.body.classList.remove(...toRemove) // remove from body
    }
}

function BodyClass({ className: classNameProp }: Props) {
    const className = classNameProp && classNameProp.trim()
    useLayoutEffect(() => {
        if (!className) { return }
        addClass(className)
        return () => { // eslint-disable-line consistent-return
            removeClass(className)
        }
    }, [className])
    return null
}

export default BodyClass
