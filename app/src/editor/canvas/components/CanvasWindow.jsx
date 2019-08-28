import React, { useRef, useContext, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'

import styles from './CanvasWindow.pcss'

export const CanvasWindowContext = React.createContext()

export function CanvasWindowProvider({ className, children }) {
    const elRef = useRef()
    return (
        <CanvasWindowContext.Provider value={elRef}>
            {children || null}
            <div className={cx(className, styles.root)} ref={elRef} />
        </CanvasWindowContext.Provider>
    )
}

export default function CanvasWindow({ children }) {
    const containerElRef = useContext(CanvasWindowContext)
    const elRef = useRef(document.createElement('div'))
    useLayoutEffect(() => {
        const { current: containerEl } = containerElRef
        const { current: el } = elRef
        if (!containerEl) {
            throw new Error('Canvas window root not found!')
        }
        containerEl.appendChild(el)
        return () => {
            containerEl.removeChild(el)
        }
    }, [containerElRef, elRef])

    return createPortal(children, elRef.current)
}
