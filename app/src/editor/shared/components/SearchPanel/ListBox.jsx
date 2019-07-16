import React, { useState, useCallback, useMemo, useRef, useContext } from 'react'
import uniqueId from 'lodash/uniqueId'

// onKeyDown handler fire callback on Enter/Spacebar
function useOnKeyDownConfirm(onClick) {
    return useCallback((event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick(event)
        }
    }, [onClick])
}

function useId(prefix) {
    const idRef = useRef()
    if (!idRef.current) {
        idRef.current = uniqueId(prefix)
    }

    return idRef.current
}

export const OPTION_SELECTOR = '[role=option]:not([aria-disabled])'

const ListContext = React.createContext()

export function ListOption({ onClick, disabled, ...props }) {
    const listContext = useContext(ListContext)
    const parentId = listContext.id
    const id = useId([parentId, 'ListOption'].join('.'))
    const { setSelected } = listContext
    const onFocus = useCallback(() => {
        setSelected(id)
    }, [id, setSelected])

    // focus on mousemove
    // mouseover no good as items can move
    const onMouseMove = useCallback((event) => {
        if (event.currentTarget !== event.target) { return } // ignore bubbled
        event.currentTarget.focus()
    }, [])

    /* treat enter/spacebar as onClick */
    const onKeyDown = useOnKeyDownConfirm(onClick)

    return (
        <div
            id={id}
            role="option"
            aria-disabled={disabled || undefined}
            aria-selected={String(listContext.isSelected(id))}
            {...(disabled ? {} : {
                // only enable interaction if not disabled
                tabIndex: -1,
                onClick,
                onKeyDown,
                onFocus,
                onMouseMove,
            })}
            {...props}
        />
    )
}

export const ListBox = React.forwardRef((props, ref) => {
    const id = useId('ListBox')

    const [selection, setSelected] = useState()
    const isSelected = useCallback((id) => (
        selection === id
    ), [selection])

    const selectNext = useCallback(() => {
        const options = Array.from(ref.current.querySelectorAll(OPTION_SELECTOR))
        const ids = options.map((el) => el.id)
        const currentIndex = ids.indexOf(selection)
        const nextIndex = (currentIndex + 1) % ids.length
        const next = options[nextIndex]
        if (!next) { return }
        next.focus()
    }, [ref, selection])

    const selectPrev = useCallback(() => {
        const options = Array.from(ref.current.querySelectorAll(OPTION_SELECTOR))
        const ids = options.map((el) => el.id)
        const currentIndex = ids.indexOf(selection)
        const prevIndex = (ids.length + (currentIndex - 1)) % ids.length
        const prev = options[prevIndex]
        if (!prev) { return }
        prev.focus()
    }, [ref, selection])

    const listContext = useMemo(() => ({
        id,
        selection,
        isSelected,
        selectPrev,
        selectNext,
        setSelected,
    }), [id, selection, isSelected, setSelected, selectNext, selectPrev])

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

    // select first item when container focussed
    const onFocus = useCallback((event) => {
        if (event.currentTarget !== event.target) { return } // ignore bubbled
        event.preventDefault()
        event.stopPropagation()
        const item = ref.current.querySelector(OPTION_SELECTOR)
        if (!item) { return }
        item.focus()
    }, [ref])

    return (
        <ListContext.Provider value={listContext}>
            <div
                id={id}
                tabIndex="0"
                role="listbox"
                ref={ref}
                onFocus={onFocus}
                aria-activedescendant={selection}
                onKeyDown={onKeyDown}
                {...props}
            />
        </ListContext.Provider>
    )
})

