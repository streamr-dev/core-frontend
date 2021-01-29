import React, { useCallback, useEffect, useMemo, useState } from 'react'

import ModuleStyles from '$editor/shared/components/Module.pcss'
import { updateModulePosition } from '../state'
import { Draggable } from './DragDropContext'
import styles from './Module.pcss'

const EMPTY = {}

export default function ModuleDragger({ api, module, children, onStartDragModule: onStartDragModuleProp }) {
    const { setCanvas } = api
    const { hash: moduleHash } = module
    const [newPosition, setNewPosition] = useState()
    const onDropModule = useCallback((event, data) => {
        if (data.diff.x === 0 && data.diff.y === 0) {
            return // do nothing if not moved
        }

        setNewPosition({
            top: data.y,
            left: data.x,
        })
    }, [setNewPosition])

    useEffect(() => {
        if (!newPosition) { return }
        setNewPosition(undefined)

        setCanvas({ type: 'Move Module' }, (canvas) => (
            updateModulePosition(canvas, moduleHash, newPosition)
        ))
    }, [setCanvas, moduleHash, newPosition])

    const onStartDragModule = useCallback(() => {
        if (onStartDragModuleProp) {
            onStartDragModuleProp(moduleHash)
        }
        return {
            moduleHash,
        }
    }, [onStartDragModuleProp, moduleHash])

    const { layout = EMPTY } = module
    const { position = EMPTY } = layout
    const defaultPosition = useMemo(() => ({
        x: parseFloat(position.left) || 0,
        y: parseFloat(position.top) || 0,
    }), [position.left, position.top])

    return (
        <Draggable
            defaultClassNameDragging={styles.isDragging}
            cancel={`.${ModuleStyles.dragCancel}`}
            handle={`.${ModuleStyles.dragHandle}`}
            defaultPosition={defaultPosition}
            onStop={onDropModule}
            onStart={onStartDragModule}
        >
            {children}
        </Draggable>
    )
}
