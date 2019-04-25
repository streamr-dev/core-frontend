// @flow

import React, { useCallback, useState, useMemo } from 'react'
import ResizerContext from '../Context'

const Provider = (props: {}) => {
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
        <ResizerContext.Provider value={value} {...props} />
    )
}

export default Provider
