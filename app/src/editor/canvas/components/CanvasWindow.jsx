import React, { useRef, useContext, useCallback, useLayoutEffect, useEffect } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import { useSelectionContext, SelectionProvider } from '$shared/hooks/useSelection'
import useUniqueId from '$shared/hooks/useUniqueId'
import styles from './CanvasWindow.pcss'

export const CanvasWindowContext = React.createContext()

// eslint-disable-next-line prefer-arrow-callback
export const CanvasWindowProvider = React.memo(function CanvasWindowProvider({ className, children }) {
    const elRef = useRef()
    return (
        <CanvasWindowContext.Provider value={elRef}>
            <SelectionProvider>
                {children || null}
                <div className={cx(className, styles.root)} ref={elRef} />
            </SelectionProvider>
        </CanvasWindowContext.Provider>
    )
})

function useSelectHandlers({ uid, elRef }) {
    const Selection = useSelectionContext()
    const onSelected = useCallback((event) => {
        const { current: el } = elRef
        if (!el.contains(event.target)) { return }
        Selection.only(uid)
    }, [elRef, Selection, uid])
    useEffect(() => {
        const { current: containerEl } = elRef
        containerEl.addEventListener('mousedown', onSelected, true)
        containerEl.addEventListener('focus', onSelected, true)
        return () => {
            containerEl.removeEventListener('mousedown', onSelected, true)
            containerEl.removeEventListener('focus', onSelected, true)
        }
    }, [onSelected, elRef])
}

export default function CanvasWindow({ className, children }) {
    const uid = useUniqueId()
    const containerElRef = useContext(CanvasWindowContext)
    const elRef = useRef(document.createElement('div'))
    const Selection = useSelectionContext()
    const isSelected = Selection.has(uid)
    useSelectHandlers({
        uid,
        elRef,
    })

    const selectionRef = useRef()
    selectionRef.current = Selection
    useEffect(() => {
        // select on mount, deselect on unmount
        const { current: selection } = selectionRef
        selection.only(uid)
        return () => {
            const { current: selection } = selectionRef
            selection.remove(uid)
        }
    }, [uid, selectionRef])

    useLayoutEffect(() => {
        const { current: el } = elRef
        el.className = cx(className, styles.CanvasWindow, {
            [styles.isSelected]: isSelected,
        })
    }, [className, isSelected])

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
