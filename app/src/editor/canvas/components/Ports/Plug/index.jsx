// @flow

import React, { useEffect, useRef, useContext } from 'react'
import cx from 'classnames'
import { type Ref } from '$shared/flowtype/common-types'
import { DropTarget, DragSource } from '../../PortDragger'
import { DragDropContext } from '../../DragDropContext'
import { canConnectPorts, hasPort } from '../../../state'

import styles from './plug.pcss'

type Props = {
    api: any,
    onValueChange: any,
    canvas: any,
    className?: ?string,
    port: any,
    register?: ?(any, ?HTMLDivElement) => void,
}

const Plug = ({
    api,
    canvas,
    className,
    port,
    register,
    onValueChange,
    ...props
}: Props) => {
    const ref: Ref<HTMLDivElement> = useRef(null)

    useEffect(() => {
        if (register) {
            register(port.id, ref.current)
        }

        return () => {
            if (register) {
                register(port.id, null)
            }
        }
    }, [ref, register, port.id])

    const { isDragging, data } = useContext(DragDropContext)
    const { sourceId, portId } = data || {}
    const fromId = sourceId || portId || null
    const dragInProgress = !!isDragging && portId != null
    const draggingFromSamePort = dragInProgress && hasPort(canvas, fromId) && port.id === fromId
    const canDrop = dragInProgress && canConnectPorts(canvas, fromId, port.id)

    return (
        <div
            {...props}
            className={cx(styles.root, className, {
                [styles.allowDrop]: !draggingFromSamePort && canDrop,
                [styles.idle]: !dragInProgress,
                [styles.ignoreDrop]: draggingFromSamePort,
                [styles.rejectDrop]: dragInProgress && !draggingFromSamePort && !canDrop,
            })}
        >
            <div
                className={cx(styles.inner, {
                    [styles.connected]: port.connected,
                    [styles.driver]: port.drivingInput,
                    [styles.exported]: port.export,
                    [styles.noRepeat]: port.noRepeat,
                    [styles.optional]: !port.requiresConnection,
                })}
                ref={ref}
                title={port.id}
            />
            <DropTarget
                className={cx(styles.dragger, styles.dropTarget)}
                port={port}
            />
            <DragSource
                api={api}
                onValueChange={onValueChange}
                className={cx(styles.dragger, styles.dragSource)}
                port={port}
            />
        </div>
    )
}

Plug.styles = styles

export default Plug
