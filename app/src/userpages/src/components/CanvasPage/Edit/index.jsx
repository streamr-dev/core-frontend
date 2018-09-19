import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCanvas } from '../../../modules/canvas/actions'

import styles from './edit.pcss'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

class Port extends React.Component {
    render() {
        const { onRef, ...port } = this.props // eslint-disable-line react/prop-types
        return (
            <React.Fragment>
                <div className={styles.port}>
                    {port.displayName || port.name}
                </div>
                <div className={`${styles.portIcon} ${port.connected ? styles.connected : ''}`} key={port.id} ref={onRef} />
            </React.Fragment>
        )
    }
}

class Canvas extends React.Component {
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
        this.positions = Object.entries(this.ports).reduce((r, [id, el]) => (
            Object.assign(r, {
                [id]: el.getBoundingClientRect(),
            })
        ), {})
        this.forceUpdate()
    }

    render() {
        const { canvas } = this.props
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
            <div className={styles.Canvas}>
                <h1>{canvas.name}</h1>
                <div className={styles.CanvasElements}>
                    <div className={styles.Nodes} ref={this.update}>
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
                                            <Port key={port.id} {...port} onRef={this.getOnPort(port)} />
                                        ))}
                                        {m.inputs.map((port) => (
                                            <Port key={port.id} {...port} onRef={this.getOnPort(port)} />
                                        ))}
                                    </div>
                                    <div className={`${styles.ports} ${styles.outputs}`}>
                                        {m.outputs.map((port) => (
                                            <Port key={port.id} {...port} onRef={this.getOnPort(port)} />
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

export default connect((state, props) => ({
    canvas: state.canvas.byId[props.match.params.id],
}), {
    getCanvas,
})(class CanvasList extends Component {
    componentDidMount() {
        this.props.getCanvas(this.props.match.params.id)
    }

    render() {
        return (
            <div className="container">
                <Canvas canvas={this.props.canvas} />
            </div>
        )
    }
})
