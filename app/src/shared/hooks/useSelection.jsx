/**
 * Manages current selection.
 * Selected item is an id.
 * Can add/remove from selection, select all or select none.
 */

import React, { useCallback, useState, useRef, useMemo, useContext } from 'react'
import t from 'prop-types'

/* eslint-disable react/no-unused-state */
const SelectionContext = React.createContext({})

const { Consumer } = SelectionContext

export { Consumer, SelectionContext }

export default function useSelection() {
    const [selection, setSelection] = useState(new Set())

    const add = useCallback((id) => (
        setSelection((prevSelection) => {
            if (prevSelection.has(id) && [...prevSelection][0] === id) {
                return prevSelection
            }
            return new Set([id, ...prevSelection])
        })
    ), [setSelection])

    const remove = useCallback((id) => (
        setSelection((prevSelection) => {
            if (!prevSelection.has(id)) { return prevSelection }
            const newSelection = new Set(prevSelection)
            newSelection.delete(id)
            return newSelection
        })
    ), [setSelection])

    const only = useCallback((id) => (
        setSelection(new Set([id]))
    ), [setSelection])

    const none = useCallback(() => (
        setSelection(new Set())
    ), [setSelection])

    const selectionRef = useRef()
    selectionRef.current = selection

    const current = useCallback(() => (
        selectionRef.current
    ), [selectionRef])

    const isEmpty = useCallback(() => (
        selectionRef.current.size === 0
    ), [selectionRef])

    const has = useCallback((id) => (
        selectionRef.current.has(id)
    ), [selectionRef])

    const last = useCallback(() => (
        [...selectionRef.current][0]
    ), [selectionRef])

    const size = useCallback(() => (
        selectionRef.current.size
    ), [selectionRef])

    return useMemo(() => ({
        isEmpty,
        selection,
        last,
        add,
        remove,
        only,
        none,
        current,
        has,
        size,
    }), [add, remove, only, none, current, has, selection, last, isEmpty, size])
}

export function useSelectionContext() {
    return useContext(SelectionContext)
}

export const SelectionProvider = ({ children }) => (
    <SelectionContext.Provider value={useSelection()}>
        {children || null}
    </SelectionContext.Provider>
)

SelectionProvider.propTypes = {
    children: t.node,
}
