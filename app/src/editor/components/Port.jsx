import React from 'react'
import cx from 'classnames'
import { DragSource, DropTarget } from '../utils/dnd'
import { DragTypes } from '../state'

import styles from './Canvas.pcss'

class Port extends React.PureComponent {
    onRef = (el) => {
        this.props.onPort(this.props.port.id, el)
    }

    render() {
        const { port, ...props } = this.props
        const isInput = !!port.acceptedTypes
        const isParam = 'defaultValue' in port

        const portContent = [
            <div
                key={`${port.id}.name`}
                className={cx(styles.portName, {
                    input: isInput,
                    output: !isInput,
                })}
            >
                {port.displayName || port.name}
            </div>,
            <div key={`${port.id}.icon`}>
                {props.connectDragSource(props.connectDropTarget((
                    <div
                        ref={this.onRef}
                        title={port.id}
                        className={cx(styles.portIcon, {
                            [styles.dragInProgress]: props.itemType,
                            [styles.dragPortInProgress]: props.itemType === DragTypes.Port,
                            [styles.dragModuleInProgress]: props.itemType === DragTypes.Module,
                            [styles.isDragging]: props.isDragging,
                            [styles.connected]: port.connected,
                            [styles.canDrop]: props.canDrop,
                            [styles.isOver]: props.isOver,
                        })}
                    />
                )))}
            </div>,
        ]

        if (isInput) {
            portContent.reverse()
        }
        if (isParam) {
            portContent.push((
                <input
                    key={`${port.id}.defaultValue`}
                    className={styles.portDefaultValue}
                    value={port.defaultValue}
                    disabled={!!port.connected}
                />
            ))
        }

        return portContent
    }
}

const PortDrag = DragSource(DragTypes.Port)
const PortDrop = DropTarget(DragTypes.Port)

export default PortDrag(PortDrop(Port))
