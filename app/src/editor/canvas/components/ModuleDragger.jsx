import React from 'react'

import { updateModulePosition } from '../state'
import { Draggable } from './DragDropContext'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import styles from './Module.pcss'

export default class ModuleDragger extends React.Component {
    onDropModule = (event, data) => {
        if (this.context.isCancelled) { return }
        if (data.diff.x === 0 && data.diff.y === 0) {
            return // do nothing if not moved
        }

        const moduleHash = this.props.module.hash
        const newPosition = {
            top: data.y,
            left: data.x,
        }

        this.props.api.setCanvas({ type: 'Move Module' }, (canvas) => (
            updateModulePosition(canvas, moduleHash, newPosition)
        ))
    }

    onStartDragModule = () => ({
        moduleHash: this.props.module.hash,
    })

    bounds = {
        top: 0,
        left: 0,
    }

    render() {
        const { module } = this.props
        const { layout } = module
        const defaultPosition = {
            x: parseInt(layout.position.left, 10),
            y: parseInt(layout.position.top, 10),
        }

        return (
            <Draggable
                defaultClassNameDragging={styles.isDragging}
                cancel={`.${ModuleStyles.dragCancel}`}
                handle={`.${ModuleStyles.dragHandle}`}
                bounds={this.bounds}
                defaultPosition={defaultPosition}
                onStop={this.onDropModule}
                onStart={this.onStartDragModule}
            >
                {this.props.children}
            </Draggable>
        )
    }
}
