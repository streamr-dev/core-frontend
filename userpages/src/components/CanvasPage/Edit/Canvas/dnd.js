import { DragSource, DropTarget } from 'react-dnd'

const DragSourceProps = (type) => DragSource(type, {
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
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))

const DropTargetProps = (type) => DropTarget(type, {
    drop(props, ...args) {
        return props.onDrop && props.onDrop(props, ...args)
    },
    canDrop(props, ...args) {
        return props.onCanDrop && props.onCanDrop(props, ...args)
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
}))

export {
    DragSourceProps as DragSource,
    DropTargetProps as DropTarget,
}
