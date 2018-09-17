import React from 'react'
import raf from 'raf'

import styles from './index.pcss'
import { DragTypes, getModulePorts } from './state'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

export default class Cables extends React.Component {
    el = React.createRef()

    state = {}

    componentDidUpdate({ itemType }) {
        if (itemType) {
            this.followDragStart()
        } else {
            this.followDragStop()
        }
    }

    followDragStart() {
        if (!this.el.current) { return }
        if (this.followingDrag) { return }
        this.initialScrollLeft = this.el.current.parentElement.scrollLeft
        this.initialScrollTop = this.el.current.parentElement.scrollTop
        this.followingDrag = true
        this.followDrag()
    }

    followDragStop() {
        this.followingDrag = false
        if (this.state.diff) {
            this.setState({ diff: undefined })
        }
    }

    followDrag = () => {
        if (!this.followingDrag) { return }
        const diff = this.props.monitor.getDifferenceFromInitialOffset()
        if (!diff || !this.el.current) { return }
        this.setState({
            diff: {
                x: diff.x + (this.el.current.parentElement.scrollLeft - this.initialScrollLeft),
                y: diff.y + (this.el.current.parentElement.scrollTop - this.initialScrollTop),
            },
        })

        raf(this.followDrag)
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
        const { itemType } = this.props

        if (itemType === DragTypes.Port) {
            return this.getCablesDraggingPort()
        }
        if (itemType === DragTypes.Module) {
            return this.getCablesDraggingModule()
        }
        return this.getStaticCables()
    }

    getCablesDraggingModule() {
        const { monitor, canvas } = this.props
        let { diff } = this.state
        diff = diff || monitor.getDifferenceFromInitialOffset()
        const { moduleId } = monitor.getItem()
        const ports = getModulePorts(canvas, moduleId)
        return this.getStaticCables().map(([from, to]) => {
            let fromNew = from
            let toNew = to
            if (ports[from.id]) {
                fromNew = {
                    id: from.id,
                    top: from.top + diff.y,
                    left: from.left + diff.x,
                }
            }
            if (ports[to.id]) {
                toNew = {
                    id: to.id,
                    top: to.top + diff.y,
                    left: to.left + diff.x,
                }
            }
            return [fromNew, toNew]
        })
    }

    getCablesDraggingPort() {
        const { monitor, positions } = this.props
        let { diff } = this.state
        diff = diff || monitor.getDifferenceFromInitialOffset()
        const { portId, sourceId } = monitor.getItem()

        const cables = this.getStaticCables().filter(([from, to]) => {
            // remove current dragged cable
            if (sourceId) {
                return !(from.id === sourceId && to.id === portId)
            }
            return true
        })

        const p = positions[portId]
        const dragCable = [
            positions[sourceId || portId],
            {
                id: 'drag',
                top: p.top + diff.y,
                left: p.left + diff.x,
                bottom: p.bottom + diff.y,
                right: p.right + diff.x,
            },
        ]

        return [
            ...cables,
            dragCable,
        ]
    }

    render() {
        const cables = this.getCables()

        return (
            <svg
                ref={this.el}
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
