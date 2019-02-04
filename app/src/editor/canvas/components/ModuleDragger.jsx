import React from 'react'

import { updateModulePosition } from '../state'
import { Draggable } from './DragDropContext'
import styles from './Module.pcss'

export default class ModuleDragger extends React.Component {
    static dragHandle = 'moduleDragHandle'

    onDropModule = (event, data) => {
        this.init = undefined

        if (this.context.isCancelled) { return }
        const moduleHash = this.props.module.hash
        const offset = {
            top: data.y,
            left: data.x,
        }
        this.props.api.setCanvas({ type: 'Move Module' }, (canvas) => (
            updateModulePosition(canvas, moduleHash, offset)
        ))
    }

    onStartDragModule = () => ({
        moduleHash: this.props.module.hash,
    })

    bounds = {
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
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
                cancel={`.${styles.dragCancel}`}
                defaultPosition={defaultPosition}
                handle={`.${styles.dragHandle}`}
                bounds={this.bounds}
                onStop={this.onDropModule}
                onStart={this.onStartDragModule}
            >
                {this.props.children}
            </Draggable>
        )
    }
}
