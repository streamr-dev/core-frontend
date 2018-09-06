import React from 'react'
import cx from 'classnames'

import styles from './Canvas.pcss'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

const Port = React.forwardRef((props, ref) => (
    <React.Fragment>
        <div className={styles.port}>
            {props.displayName || props.name}
        </div>
        <div
            ref={ref}
            key={props.id}
            className={cx(styles.portIcon, {
                [styles.connected]: props.connected,
            })}
        />
    </React.Fragment>
))

export default class Canvas extends React.Component {
    state = {}

    ports = {}

    positions = {}

    componentDidMount() {
        this.update()
    }

    getOnPort(port) {
        return (el) => {
            this.ports = {
                ...this.ports,
                [port.id]: el,
            }
            if (!el) {
                this.positions = {
                    ...this.positions,
                    [port.id]: undefined,
                }
            }
        }
    }

    update = () => {
        if (!this.nodes) {
            return
        }

        const offset = this.nodes.getBoundingClientRect()
        this.positions = Object.entries(this.ports).reduce((r, [id, el]) => {
            const elRect = el.getBoundingClientRect()
            const rect = {
                top: elRect.top - offset.top,
                left: elRect.left - offset.left,
                right: elRect.right - offset.right,
                bottom: elRect.bottom - offset.bottom,
                width: elRect.width,
                height: elRect.height,
            }
            return Object.assign(r, {
                [id]: rect,
            })
        }, {})
        this.forceUpdate()
    }

    nodesRef = (el) => {
        this.nodes = el
        this.update()
    }

    render() {
        const { canvas, className } = this.props
        if (!canvas) { return null }
        const connections = canvas.modules.reduce((c, m) => {
            m.params.forEach((port) => {
                if (!port.connected) { return }
                c.push([port.sourceId, port.id])
            })
            m.inputs.forEach((port) => {
                if (!port.connected) { return }
                c.push([port.sourceId, port.id])
            })
            return c
        }, [])
        return (
            <div className={cx(styles.Canvas, className)}>
                <div className={styles.CanvasElements}>
                    <div className={styles.Nodes} ref={this.nodesRef}>
                        {canvas.modules.map((m) => (
                            <div
                                key={`${m.id}-${m.hash}`}
                                className={styles.Module}
                                style={{
                                    top: m.layout.position.top,
                                    left: m.layout.position.left,
                                    width: m.layout.width,
                                    height: m.layout.height,
                                }}
                            >
                                <div className={styles.moduleHeader}>
                                    <div className={styles.name}>{m.name}</div>
                                </div>
                                <div className={styles.portsContainer}>
                                    <div className={`${styles.ports} ${styles.inputs}`}>
                                        {m.params.map((port) => (
                                            <Port key={port.id} {...port} ref={this.getOnPort(port)} />
                                        ))}
                                        {m.inputs.map((port) => (
                                            <Port key={port.id} {...port} ref={this.getOnPort(port)} />
                                        ))}
                                    </div>
                                    <div className={`${styles.ports} ${styles.outputs}`}>
                                        {m.outputs.map((port) => (
                                            <Port key={port.id} {...port} ref={this.getOnPort(port)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <svg
                        className={styles.Connections}
                        preserveAspectRatio="xMidYMid meet"
                        height="100%"
                        width="100%"
                    >
                        {connections.map(([from, to]) => {
                            const { positions } = this
                            if (!positions[from] || !positions[to]) { return null }
                            const halfHeight = positions[from].height / 2
                            const halfWidth = positions[from].width / 2
                            return (
                                <path
                                    key={`${from}-${to}`}
                                    className={styles.Connection}
                                    d={curvedHorizontal(
                                        positions[from].left + halfWidth,
                                        positions[from].top + halfHeight,
                                        positions[to].left + halfWidth,
                                        positions[to].top + halfHeight,
                                    )}
                                />
                            )
                        })}
                    </svg>
                </div>
            </div>
        )
    }
}
