import React, { useState, useCallback, useMemo, useRef, useContext, useLayoutEffect } from 'react'
import uniqueId from 'lodash/uniqueId'

/*
 * Provides a constant uid for a component
 * Takes one more more prefixes for debuggability
 */

function useId(...prefixes) {
    const idRef = useRef()
    if (!idRef.current) {
        let prefix = prefixes.join('.')
        // add trailing e.g. a.b => a.b. => a.b.123
        prefix = prefix ? `${prefix}.` : undefined
        idRef.current = uniqueId(prefix)
    }

    return idRef.current
}

export const OPTION_SELECTOR = '[role=option]:not([aria-disabled])'

const ListContext = React.createContext()

export function ListOption({ disabled, ...props }) {
    const el = useRef()
    const listContext = useContext(ListContext)
    const parentId = listContext.id
    const id = useId(parentId, 'ListOption')
    const { setSelected } = listContext
    const onFocus = useCallback(() => {
        setSelected(id)
    }, [id, setSelected])

    // focus on mousemove
    // mouseover no good as items can move
    const onMouseMove = useCallback((event) => {
        if (event.currentTarget !== event.target) { return } // ignore bubbled
        setSelected(id)
    }, [setSelected, id])

    /* treat enter/spacebar as onClick */
    const onKeyDown = useCallback((event) => {
        if (!el.current) { return }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            el.current.click()
        }
    }, [el])

    const [isSelected, setIsSelected] = useState(listContext.isSelected(id))
    // need to reconfigure isSelected state after render
    // otherwise it will be reading element ordering from the stale list
    useLayoutEffect(() => {
        const nextIsSelected = listContext.isSelected(id)
        if (nextIsSelected === isSelected) { return }
        if (!nextIsSelected) {
            // ensure blurred when selection leaves element
            el.current.blur()
        }
        setIsSelected(nextIsSelected)
    }, [setIsSelected, listContext, isSelected, id])

    return (
        <div
            ref={el}
            id={id}
            role="option"
            aria-disabled={disabled || undefined}
            aria-selected={String(isSelected)}
            {...(disabled ? {} : {
                // only enable interaction if not disabled
                tabIndex: -1,
                onKeyDown,
                onFocus,
                onMouseMove,
            })}
            {...props}
        />
    )
}

export const ListBox = React.forwardRef(({ listContextRef, ...props }, ref) => {
    const id = useId('ListBox')

    const [selection, setSelectedState] = useState(0)

    const adjustSelectedIndex = useCallback((amount) => {
        if (!ref.current) { return }
        const options = ref.current.querySelectorAll(OPTION_SELECTOR)
        setSelectedState((index) => (
            (options.length + index + amount) % options.length
        ))
    }, [setSelectedState, ref])

    const [selectedEl, setSelectedEl] = useState()

    const getSelectedEl = useCallback(() => {
        if (!ref.current) { return }
        const options = Array.from(ref.current.querySelectorAll(OPTION_SELECTOR))
        return options[selection]
    }, [ref, selection])

    const isSelected = useCallback((id) => {
        const el = getSelectedEl()
        const isSelectedEl = !!(el && el.id === id)
        // piggy back on this to also set the selected el
        if (isSelectedEl && el !== selectedEl) {
            setSelectedEl(el)
        }
        return isSelectedEl
    }, [setSelectedEl, selectedEl, getSelectedEl])

    const selectNext = useCallback(() => {
        adjustSelectedIndex(1)
    }, [adjustSelectedIndex])

    const selectPrev = useCallback(() => {
        adjustSelectedIndex(-1)
    }, [adjustSelectedIndex])

    const setSelected = useCallback((id) => {
        const options = Array.from(ref.current.querySelectorAll(OPTION_SELECTOR))
        const ids = options.map((el) => el.id)
        const selectedIndex = ids.indexOf(id)
        setSelectedState(Math.max(0, selectedIndex))
    }, [ref, setSelectedState])

    const listContext = useMemo(() => ({
        id,
        selection,
        isSelected,
        selectPrev,
        selectNext,
        setSelected,
        getSelectedEl,
    }), [id, selection, isSelected, setSelected, selectNext, selectPrev, getSelectedEl])

    const onKeyDown = useCallback((event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            selectNext()
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            selectPrev()
        }
    }, [selectNext, selectPrev])

    listContextRef.current = listContext

    return (
        <ListContext.Provider value={listContext}>
            <div
                id={id}
                tabIndex="0"
                role="listbox"
                ref={ref}
                aria-activedescendant={selectedEl && selectedEl.id}
                onKeyDown={onKeyDown}
                {...props}
            />
        </ListContext.Provider>
    )
})

