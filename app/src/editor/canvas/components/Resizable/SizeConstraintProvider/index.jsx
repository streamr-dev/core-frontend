// @flow

import React, { type Node, type Context, createContext, useMemo, useState, useCallback } from 'react'

type ContextProps = {
    minHeight: number,
    minWidth: number,
    probeRefreshCount: number,
    refreshProbes: () => void,
    setHeight: (string, string, number) => void,
    setWidth: (string, string, number) => void,
}

const defaultContext: ContextProps = {
    minHeight: 0,
    minWidth: 0,
    probeRefreshCount: 0,
    refreshProbes: () => {},
    setHeight: () => {},
    setWidth: () => {},
}

const SizeConstraintContext: Context<ContextProps> = createContext(defaultContext)

export { SizeConstraintContext as Context }

type Props = {
    children?: Node,
}

const SizeConstraintProvider = ({ children }: Props) => {
    const [widths, setWidths] = useState({})
    const [heights, setHeights] = useState({})
    const [probeRefreshCount, setProbeRefreshCount] = useState(0)

    const setWidth = useCallback((group: string, id: string, width: number) => {
        setWidths((widths) => ({
            ...widths,
            [group]: {
                ...(widths || {})[group],
                [id]: width,
            },
        }))
    }, [setWidths])

    const setHeight = useCallback((group: string, id: string, height: number) => {
        setHeights((heights) => ({
            ...heights,
            [group]: {
                ...(heights || {})[group],
                [id]: height,
            },
        }))
    }, [setHeights])

    const refreshProbes = useCallback(() => {
        setProbeRefreshCount((count) => count + 1)
    }, [])

    const minWidth = useMemo(() => Object.values(widths).reduce((min, group) => (
        Math.max(Object.values(group).reduce((sum, value) => sum + ((value: any): number), 0), min)
    ), -1), [widths])

    const minHeight = useMemo(() => Object.values(heights).reduce((min, group) => (
        Math.max(Object.values(group).reduce((sum, value) => sum + ((value: any): number), 0), min)
    ), -1), [heights])

    const value = useMemo(() => ({
        minHeight,
        minWidth,
        probeRefreshCount,
        refreshProbes,
        setHeight,
        setWidth,
    }), [
        minHeight,
        minWidth,
        probeRefreshCount,
        refreshProbes,
        setHeight,
        setWidth,
    ])

    return (
        <SizeConstraintContext.Provider value={value}>
            {children}
        </SizeConstraintContext.Provider>
    )
}

export default SizeConstraintProvider
