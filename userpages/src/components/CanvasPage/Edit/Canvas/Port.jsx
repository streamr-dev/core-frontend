import React from 'react'
import cx from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'

import styles from './index.pcss'
import { DragTypes } from './state'

class Port extends React.Component {
    render() {
        const { port, ...props } = this.props
        return (
            <React.Fragment>
                <div className={styles.port}>
                    {port.displayName || port.name}
                </div>
                {props.connectDragSource(props.connectDropTarget((
                    <div
                        ref={props.forwardedRef}
                        key={port.id}
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
            </React.Fragment>
        )
    }
}

const PortDrag = DragSource(DragTypes.Port, {
    beginDrag(props) {
        return props
    },
    canDrag({ port }) {
        return !!port.canConnect
    },
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))

const PortDrop = DropTarget(DragTypes.Port, {
    canDrop(to, monitor) {
        const from = monitor.getItem()
        if (from.direction === to.direction) { return false }

        const ports = [from.port, to.port]
        if (from.direction === 'input') {
            ports.reverse()
        }

        const [input, output] = ports
        if (!input.canConnect) { return false }
        const inputTypes = new Set(input.acceptedTypes)
        if (output.type === 'Object' || inputTypes.has('Object')) { return true }
        return inputTypes.has(output.type)
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
}))

const PortDragDropInner = PortDrag(PortDrop(Port))
const PortDragDrop = React.forwardRef((props, ref) => (
    <PortDragDropInner forwardedRef={ref} {...props} />
))

export default PortDragDrop
