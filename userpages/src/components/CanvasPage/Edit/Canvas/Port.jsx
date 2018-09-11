import React from 'react'
import cx from 'classnames'
import { DragSource, DropTarget } from './dnd'

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

const PortDrag = DragSource(DragTypes.Port)
const PortDrop = DropTarget(DragTypes.Port)

const PortDragDropInner = PortDrag(PortDrop(Port))
const PortDragDrop = React.forwardRef((props, ref) => (
    <PortDragDropInner forwardedRef={ref} {...props} />
))

export default PortDragDrop
