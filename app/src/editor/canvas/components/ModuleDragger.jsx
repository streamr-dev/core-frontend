import React, { useCallback, useMemo } from 'react'

import { updateModulePosition } from '../state'
import { Draggable } from './DragDropContext'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import styles from './Module.pcss'

const EMPTY = {}

export default function ModuleDragger({ api, module, children, onStartDragModule: onStartDragModuleProp }) {
    const { setCanvas } = api
    const { hash: moduleHash } = module
    const onDropModule = useCallback((event, data) => {
        if (data.diff.x === 0 && data.diff.y === 0) {
            return // do nothing if not moved
        }

        const newPosition = {
            top: data.y,
            left: data.x,
        }

        setCanvas({ type: 'Move Module' }, (canvas) => (
            updateModulePosition(canvas, moduleHash, newPosition)
        ))
    }, [setCanvas, moduleHash])

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
        x: parseInt(position.left, 10) || 0,
        y: parseInt(position.top, 10) || 0,
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
