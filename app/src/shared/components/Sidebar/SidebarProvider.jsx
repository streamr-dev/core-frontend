// @flow

import React, { type Context, type Node } from 'react'

type SidebarContextType = {
    current: ?string,
    open: (string, ?boolean) => void,
    close: (?string) => void,
    toggle: (string) => void,
    isOpen: (?string) => boolean,
}

// when sidebar is closed, current sidebar value is undefined.
// give name so more descriptive.
const CLOSED = undefined

function notInitialized() {
    // throw if trying to use context without provider
    throw new Error('SidebarContext not initialized')
}

export const SidebarContext: Context<SidebarContextType> = React.createContext({
    current: CLOSED,
    open: notInitialized,
    close: notInitialized,
    toggle: notInitialized,
    isOpen: notInitialized,
})

export type Props = {
    children?: Node,
}

export default function SidebarProvider({ children }: Props) {
    const [currentSidebar, setCurrentSidebar] = React.useState()

    const openSidebar = React.useCallback((sidebarName, doOpen = true) => {
        setCurrentSidebar(doOpen ? sidebarName : CLOSED)
    }, [])

    const closeSidebar = React.useCallback((sidebarName) => {
        setCurrentSidebar((prevSidebar) => {
            if (sidebarName) {
                // only close if matching name
                if (prevSidebar === sidebarName) { return CLOSED }
                // do nothing if no match
                return prevSidebar
            }

            // close any sidebar if no sidebar specified
            return CLOSED
        })
    }, [])

    const toggleSidebar = React.useCallback((sidebarName) => {
        setCurrentSidebar((prevSidebar) => {
            // only toggle to closed if specified sidebar currently open
            if (prevSidebar === sidebarName) { return CLOSED }
            // open specified sidebar
            return sidebarName
        })
    }, [])

    const isOpen = React.useCallback((sidebarName) => {
        if (sidebarName) {
            return currentSidebar === sidebarName
        }

        return currentSidebar !== CLOSED
    }, [currentSidebar])

    const sidebarContext = React.useMemo(() => ({
        current: currentSidebar,
        open: openSidebar,
        close: closeSidebar,
        toggle: toggleSidebar,
        isOpen,
    }), [
        currentSidebar,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        isOpen,
    ])

    return (
        <SidebarContext.Provider value={sidebarContext}>
            {children}
        </SidebarContext.Provider>
    )
}

