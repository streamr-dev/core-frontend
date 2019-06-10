/**
 * Manages current selection.
 * Selected item is an id.
 * Can add/remove from selection, select all or select none.
 */

import React, { useCallback, useState, useRef, useMemo, useContext } from 'react'

/* eslint-disable react/no-unused-state */
const SelectionContext = React.createContext({})
const { Consumer } = SelectionContext

export { Consumer, SelectionContext }

export default function useSelection() {
    const [selection, setSelection] = useState(new Set())

    const add = useCallback((id) => (
        setSelection((selection) => {
            if (selection.has(id)) { return selection }
            return new Set([...selection, id])
        })
    ), [setSelection])

    const remove = useCallback((id) => (
        setSelection((selection) => {
            if (!selection.has(id)) { return selection }
            const newSelection = new Set(selection)
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

    return useMemo(() => ({
        isEmpty,
        selection,
        add,
        remove,
        only,
        none,
        current,
        has,
    }), [add, remove, only, none, current, has, selection, isEmpty])
}

export function useSelectionContext() {
    return useContext(SelectionContext)
}

export const SelectionProvider = ({ children }) => (
    <SelectionContext.Provider value={useSelection()}>
        {children || null}
    </SelectionContext.Provider>
)
