import React, { useState, useCallback, useMemo, useRef, useContext, useEffect, useLayoutEffect } from 'react'
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

    // unset on unmount
    useEffect(() => () => {
        idRef.current = undefined
    }, [])

    return idRef.current
}

export const OPTION_SELECTOR = '[role=option]:not([aria-disabled])'

const ListContext = React.createContext()

/* eslint-disable object-curly-newline */
export function ListOption({
    disabled = false,
    refName = 'ref', // support alternative ref props, e.g. innerRef
    component = 'div', // support dynamic component e.g. a, Link
    ...props
}) {
    /* eslint-enable object-curly-newline */
    // allow ref prop to be optional
    const internalRef = useRef()
    const elRef = props[refName] || internalRef
    const Component = component
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

    /* treat enter/spacebar/rightarrow as onClick */
    const onKeyDown = useCallback((event) => {
        if (!elRef.current) { return }
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
            event.preventDefault()
            elRef.current.click()
        }
    }, [elRef])

    const [isSelected, setIsSelected] = useState(listContext.isSelected(id))
    // need to reconfigure isSelected state after render
    // otherwise it will be reading element ordering from the stale list
    useLayoutEffect(() => {
        const nextIsSelected = listContext.isSelected(id)
        // do nothing if no change
        if (nextIsSelected === isSelected) { return }
        setIsSelected(nextIsSelected)
    }, [setIsSelected, listContext, isSelected, id, elRef])

    useEffect(() => {
        if (!isSelected) {
            // ensure blurred when selectedIndex leaves element
            if (document.activeElement === elRef.current) {
                elRef.current.blur()
            }
        } else {
            // ensure scrolled into view when selected
            elRef.current.scrollIntoView({
                behavior: 'smooth',
                scrollMode: 'if-needed',
                block: 'nearest',
                inline: 'nearest',
            })
        }
    }, [isSelected, id, elRef])

    const refProp = {
        [refName]: elRef, // dynamic ref
    }

    return (
        <Component
            id={id}
            role="option"
            aria-disabled={disabled || undefined}
            aria-selected={String(isSelected)}
            {...refProp}
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

/**
 * Clamp value between min & max
 * If max < min, min = max
 */
function clamp(value, min, max) {
    if (max < min) { max = min } // don't allow max < min
    return Math.max(min, Math.min(max, value))
}

export function useOptionalRef(externalRef) {
    // allow ref prop to be optional
    const internalRef = useRef()
    return externalRef || internalRef
}

function useListBoxContext(externalRef) {
    // allow ref prop to be optional
    const ref = useOptionalRef(externalRef)

    // ListBox needs unique id so ListOptions can have ListBox-scoped ids
    // So aria-activedescendant={selectedId} is valid
    const id = useId('ListBox')

    const [selectedIndex, setSelectedIndexState] = useState(0)

    /**
     * Move selectedIndex forward or backwards with wrap around.
     */
    const adjustSelectedIndex = useCallback((amount = 0) => {
        if (!ref.current) { return }

        setSelectedIndexState((index = 0) => {
            const options = ref.current.querySelectorAll(OPTION_SELECTOR)
            if (!options.length) { return 0 } // ignore if no options
            // ensure movement relative to current list bounds
            index = clamp(index, 0, options.length - 1)
            // starting at options.length enables backwards wrap around
            return (options.length + index + amount) % options.length
        })
    }, [setSelectedIndexState, ref])

    const selectNext = useCallback(() => {
        adjustSelectedIndex(1)
    }, [adjustSelectedIndex])

    const selectPrev = useCallback(() => {
        adjustSelectedIndex(-1)
    }, [adjustSelectedIndex])

    const [selectedEl, setSelectedEl] = useState()

    /**
     * Finds element matching selected index
     */
    const getSelectedEl = useCallback(() => {
        if (!ref.current) { return }
        const options = ref.current.querySelectorAll(OPTION_SELECTOR)
        return options[clamp(selectedIndex, 0, options.length - 1)]
    }, [ref, selectedIndex])

    /**
     * True if id matches selected element
     */
    const isSelected = useCallback((id) => {
        const el = getSelectedEl()
        const isSelectedEl = !!(el && el.id === id)
        // piggy back on this to also set the selected el
        if (isSelectedEl && el !== selectedEl) {
            setSelectedEl(el)
        }
        return isSelectedEl
    }, [setSelectedEl, selectedEl, getSelectedEl])

    /**
     * Maps passed-in id to index in options collection
     * Sets as selected index, or 0 if not found.
     */
    const setSelected = useCallback((id) => {
        const options = Array.from(ref.current.querySelectorAll(OPTION_SELECTOR))
        const ids = options.map((el) => el.id)
        const selectedIndex = ids.indexOf(id)
        setSelectedIndexState(clamp(selectedIndex, 0, ids.length - 1))
    }, [ref, setSelectedIndexState])

    /**
     * Build list context API
     */
    return useMemo(() => ({
        id,
        selectedIndex,
        isSelected,
        selectPrev,
        selectNext,
        setSelected,
        getSelectedEl,
    }), [
        id,
        selectedIndex,
        isSelected,
        selectPrev,
        selectNext,
        setSelected,
        getSelectedEl,
    ])
}

export const useListBoxOnKeyDownCallback = (externalListContextRef) => {
    const listContextRef = useOptionalRef(externalListContextRef)
    return useCallback((event) => {
        const listContext = listContextRef.current
        if (!listContext) { return }
        if (event.currentTarget !== event.target && event.currentTarget !== window) { return } // ignore bubbled
        if (event.key === 'ArrowDown') {
            event.stopPropagation()
            event.preventDefault()
            listContext.selectNext()
        }
        if (event.key === 'ArrowUp') {
            event.stopPropagation()
            event.preventDefault()
            listContext.selectPrev()
        }

        if (event.key === 'Enter') {
            event.stopPropagation()
            event.preventDefault()
            const el = listContext.getSelectedEl()
            if (el) {
                el.click()
            }
        }
    }, [listContextRef])
}

export function useListBoxInteraction(listContextRef) {
    const [isInteractive, setIsInteractive] = useState(false)

    const onKeyDown = useListBoxOnKeyDownCallback(listContextRef)

    /**
     * Attach keyboard handlers whenever mouse over listbox
     */
    const enable = useCallback(() => {
        if (isInteractive) { return }
        setIsInteractive(true)
    }, [setIsInteractive, isInteractive])

    const disable = useCallback(() => {
        if (!isInteractive) { return }
        setIsInteractive(false)
    }, [setIsInteractive, isInteractive])

    useEffect(() => {
        if (!isInteractive) { return }
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isInteractive, onKeyDown])

    return useMemo(() => ({
        enable,
        disable,
        onKeyDown,
    }), [enable, disable, onKeyDown])
}

export const ListBox = React.forwardRef(({ listContextRef: externalListContextRef, ...props }, ref) => {
    const listContext = useListBoxContext(ref)
    const listContextRef = useOptionalRef(externalListContextRef)

    /**
     * Provide ref to context API for parent to control
     */
    listContextRef.current = listContext
    useEffect(() => () => {
        // unset on unmount
        listContextRef.current = undefined
    }, [listContextRef])

    const { onKeyDown } = useListBoxInteraction(listContextRef)

    const selectedEl = listContext.getSelectedEl()

    return (
        <ListContext.Provider value={listContext}>
            <div
                id={listContext.id}
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

