import React from 'react'

import styles from './index.pcss'
import { DragTypes } from './state'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

export default class Cables extends React.Component {
    state = {}

    componentDidUpdate({ itemType }) {
        if (itemType === DragTypes.Port) {
            this.followDragStart()
        } else {
            this.followDragStop()
        }
    }

    followDragStart() {
        if (this.followingDrag) { return }
        this.followingDrag = true
        const { portId } = this.props.monitor.getItem()
        this.o = this.props.positions[portId]
        this.setState({
            dragPosition: this.o,
        })
        window.requestAnimationFrame(this.followDrag)
    }

    followDrag = () => {
        const { monitor, itemType } = this.props
        const diff = monitor.getDifferenceFromInitialOffset()
        const { o } = this
        if (!itemType || !this.followingDrag || !diff) { return }
        this.setState({
            dragPosition: {
                id: 'drag',
                top: o.top + diff.y,
                left: o.left + diff.x,
                bottom: o.bottom + diff.y,
                right: o.right + diff.x,
            },
        })
        window.requestAnimationFrame(this.followDrag)
    }

    followDragStop() {
        this.followingDrag = false
        this.o = undefined
        if (this.state.dragPosition) {
            this.setState({
                dragPosition: undefined,
            })
        }
    }

    getStaticCables() {
        const { canvas, positions } = this.props
        return canvas.modules
            .reduce((c, m) => {
                m.params.forEach((port) => {
                    if (!port.connected) { return }
                    c.push([port.sourceId, port.id])
                })
                m.inputs.forEach((port) => {
                    if (!port.connected) { return }
                    c.push([port.sourceId, port.id])
                })
                m.outputs.forEach((port) => {
                    if (!port.connected) { return }
                    c.push([port.sourceId, port.id])
                })
                return c
            }, [])
            .map(([from, to]) => [positions[from], positions[to]])
            .filter(([from, to]) => from && to)
    }

    getCables() {
        const { monitor, positions, itemType } = this.props
        const { dragPosition } = this.state
        const staticCables = this.getStaticCables()
        if (!dragPosition || !itemType) {
            return staticCables
        }
        const { portId, sourceId } = monitor.getItem()

        const staticWithoutCurrent = staticCables.filter(([from, to]) => {
            if (sourceId) {
                return !(from.id === sourceId && to.id === portId)
            }
            return true
        })

        const dragCable = [
            positions[sourceId || portId],
            dragPosition,
        ]

        return [
            ...staticWithoutCurrent,
            dragCable,
        ]
    }

    render() {
        const cables = this.getCables()

        return (
            <svg
                className={styles.Cables}
                preserveAspectRatio="xMidYMid meet"
                height="100%"
                width="100%"
            >
                {cables.map(([from, to]) => (
                    <path
                        key={`${from.id}-${to.id}`}
                        className={styles.Connection}
                        d={curvedHorizontal(
                            from.left,
                            from.top,
                            to.left,
                            to.top,
                        )}
                    />
                ))}
            </svg>
        )
    }
}
