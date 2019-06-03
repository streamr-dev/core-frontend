// @flow

import { useState, useCallback, useMemo } from 'react'

export type Layout = {
    dragging: boolean,
    resizing: boolean,
    x: number,
    y: number,
    width: number,
    height: number,
}

export default (initialState: Layout = {}) => {
    const [layout, setLayout] = useState({
        dragging: false,
        resizing: false,
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        ...initialState,
    })
    const updatePosition = useCallback((x: number, y: number) => {
        setLayout((state) => ({
            ...state,
            x,
            y,
        }))
    }, [setLayout])
    const updateSize = useCallback((width: number, height: number) => {
        setLayout((state) => ({
            ...state,
            width,
            height,
        }))
    }, [setLayout])
    const setDragging = useCallback((dragging: boolean = true) => {
        setLayout((state) => ({
            ...state,
            dragging,
        }))
    }, [setLayout])
    const setResizing = useCallback((resizing: boolean = true) => {
        setLayout((state) => ({
            ...state,
            resizing,
        }))
    }, [setLayout])
    return useMemo(() => (
        [layout, updateSize, updatePosition, setDragging, setResizing]
    ), [layout, updateSize, updatePosition, setDragging, setResizing])
}
