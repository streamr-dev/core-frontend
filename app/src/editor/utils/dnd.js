/*
 * Wraps react-dnd DragSource/DropTarget to supply default props and
 * allow specifying drag/drop behaviour as props e.g. onDrag
 */

import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import memoize from 'lodash/memoize'

// create upfront, prevents flickering of wrong icon on drag
export const emptyImage = getEmptyImage()
const DragSourceProps = memoize((type) => DragSource(type, {
    beginDrag(props, ...args) {
        return props.onDrag && props.onDrag(props, ...args)
    },
    endDrag(props, ...args) {
        return props.onDragEnd && props.onDragEnd(props, ...args)
    },
    canDrag(props, ...args) {
        return props.onCanDrag && props.onCanDrag(props, ...args)
    },
}, (connect, monitor) => ({
    monitor,
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
})))

const DropTargetProps = memoize((type) => DropTarget(type, {
    drop(props, ...args) {
        return props.onDrop && props.onDrop(props, ...args)
    },
    canDrop(props, ...args) {
        return props.onCanDrop && props.onCanDrop(props, ...args)
    },
}, (connect, monitor) => ({
    monitor,
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({
        shallow: true,
    }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
})))

export {
    DragSourceProps as DragSource,
    DropTargetProps as DropTarget,
}

