import React from 'react'

import styles from './index.pcss'

function curvedHorizontal(x1, y1, x2, y2) {
    const line = []
    const mx = x1 + ((x2 - x1) / 2)

    line.push('M', x1, y1)
    line.push('C', mx, y1, mx, y2, x2, y2)

    return line.join(' ')
}

export default class Cables extends React.Component {
    render() {
        const { canvas, positions } = this.props
        const cables = canvas.modules.reduce((c, m) => {
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
        return (
            <svg
                className={styles.Cables}
                preserveAspectRatio="xMidYMid meet"
                height="100%"
                width="100%"
            >
                {cables.map(([from, to]) => {
                    if (!positions[from] || !positions[to]) { return null }
                    return (
                        <path
                            key={`${from}-${to}`}
                            className={styles.Connection}
                            d={curvedHorizontal(
                                positions[from].left + positions[from].width / 2,
                                positions[from].top + positions[from].height / 2,
                                positions[to].left + positions[to].width / 2,
                                positions[to].top + positions[to].height / 2,
                            )}
                        />
                    )
                })}
            </svg>
        )
    }
}
