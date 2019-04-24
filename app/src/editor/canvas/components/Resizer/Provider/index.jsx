// @flow

import React, { useCallback, useState, useMemo } from 'react'
import ResizerContext from '../Context'

const Provider = (props: {}) => {
    const [widths, setWidths] = useState({})
    const [heights, setHeights] = useState({})

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

    const minWidth = useMemo(() => Object.values(widths).reduce((min, group) => (
        Math.max(Object.values(group).reduce((sum, value) => sum + ((value: any): number), 0), min)
    ), -1), [widths])

    const minHeight = useMemo(() => Object.values(heights).reduce((min, group) => (
        Math.max(Object.values(group).reduce((sum, value) => sum + ((value: any): number), 0), min)
    ), -1), [heights])

    const value = useMemo(() => ({
        minHeight,
        minWidth,
        setHeight,
        setWidth,
    }), [
        minHeight,
        minWidth,
        setHeight,
        setWidth,
    ])

    return (
        <ResizerContext.Provider value={value} {...props} />
    )
}

export default Provider
