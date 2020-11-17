// @flow

import React, { type Context, type Node, useContext } from 'react'

type SidebarContextType = {
    open: (string, ?boolean) => void,
    close: (?string) => void,
    toggle: (string) => void,
    isOpen: (?string) => boolean,
    addTransitionCheck: ((?string, ?string) => ?boolean) => void,
    removeTransitionCheck: ((?string, ?string) => ?boolean) => void,
}

// when sidebar is closed, current sidebar value is undefined.
// give name so more descriptive.
const CLOSED = undefined

function notInitialized() {
    // throw if trying to use context without provider
    throw new Error('SidebarContext not initialized')
}

export const SidebarContext: Context<SidebarContextType> = React.createContext({
    open: notInitialized,
    close: notInitialized,
    toggle: notInitialized,
    isOpen: notInitialized,
    addTransitionCheck: notInitialized,
    removeTransitionCheck: notInitialized,
})

export const useSidebar = () => useContext(SidebarContext)

export type Props = {
    children?: Node,
}

export default function SidebarProvider({ children }: Props) {
    const [currentSidebar, setCurrentSidebar] = React.useState(CLOSED)
    const transitionChecksRef = React.useRef([])
    const trySetCurrentSidebar = React.useCallback((fn) => {
        setCurrentSidebar((prevValue) => {
            const nextValue = typeof fn === 'function' ? fn(prevValue) : fn
            const canTransition = transitionChecksRef.current.every((check) => check(prevValue, nextValue))
            if (!canTransition) { return prevValue }
            return nextValue
        })
    }, [setCurrentSidebar, transitionChecksRef])

    const openSidebar = React.useCallback((sidebarName, doOpen = true) => {
        trySetCurrentSidebar(doOpen ? sidebarName : CLOSED)
    }, [trySetCurrentSidebar])

    const closeSidebar = React.useCallback((sidebarName) => {
        trySetCurrentSidebar((prevSidebar) => {
            if (sidebarName) {
                // only close if matching name
                if (prevSidebar === sidebarName) { return CLOSED }
                // do nothing if no match
                return prevSidebar
            }

            // close any sidebar if no sidebar specified
            return CLOSED
        })
    }, [trySetCurrentSidebar])

    const toggleSidebar = React.useCallback((sidebarName) => {
        trySetCurrentSidebar((prevSidebar) => {
            // only toggle to closed if specified sidebar currently open
            if (prevSidebar === sidebarName) {
                return CLOSED
            }
            // open specified sidebar
            return sidebarName
        })
    }, [trySetCurrentSidebar])

    const isOpen = React.useCallback((sidebarName) => {
        if (sidebarName) {
            return currentSidebar === sidebarName
        }

        return currentSidebar !== CLOSED
    }, [currentSidebar])

    const addTransitionCheck = React.useCallback((check) => {
        const prevChecks = transitionChecksRef.current
        if (prevChecks.includes(check)) { return }
        transitionChecksRef.current = [...prevChecks, check]
    }, [transitionChecksRef])

    const removeTransitionCheck = React.useCallback((check) => {
        const prevChecks = transitionChecksRef.current
        if (!prevChecks.includes(check)) { return }
        transitionChecksRef.current = prevChecks.filter((c) => c !== check)
    }, [transitionChecksRef])

    const sidebarContext = React.useMemo(() => ({
        open: openSidebar,
        close: closeSidebar,
        toggle: toggleSidebar,
        isOpen,
        addTransitionCheck,
        removeTransitionCheck,
    }), [
        openSidebar,
        closeSidebar,
        toggleSidebar,
        isOpen,
        addTransitionCheck,
        removeTransitionCheck,
    ])

    return (
        <SidebarContext.Provider value={sidebarContext}>
            {children}
        </SidebarContext.Provider>
    )
}

