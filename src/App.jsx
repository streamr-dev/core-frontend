import React, { Component } from 'react'
import './App.css'

const DEFAULT_OPTIONS = Object.freeze({
    redirect: 'follow',
    credentials: 'include',
    mode: 'cors',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'token tester1-api-key',
    },
})

function fetchCanvas(id) {
    return window.fetch(`http://localhost:8081/streamr-core/api/v1/canvases/${id}`, DEFAULT_OPTIONS)
        .then((r) => r.json())
}

const { Provider, Consumer } = React.createContext({})

export default class App extends Component {
    state = {}

    componentDidMount() {
        this.load()
    }

    async load() {
        const canvas = await fetchCanvas('heMwO-9QQayWxYZtja-ZCA')
        this.setState(canvas)
    }

    render() {
        return (
            <Provider value={this.state}>
                <div className="App">
                    <Sidebar />
                    <Canvas />
                </div>
            </Provider>
        )
    }
}

class Sidebar extends React.Component {
    render() {
        return (
            <div className="Sidebar">
                <button type="button">Run</button>
            </div>
        )
    }
}

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
                <div className="port">
                    {port.name}
                </div>
                <div className={`portIcon ${port.connected ? 'connected' : ''}`} key={port.id} ref={onRef} />
            </React.Fragment>
        )
    }
}

class Canvas extends React.Component {
    state = {}

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

    ports = {}
    positions = {}

    update = () => {
        this.positions = Object.entries(this.ports).reduce((r, [id, el]) => (
            Object.assign(r, {
                [id]: el.getBoundingClientRect(),
            })
        ), {})
        this.forceUpdate()
    }

    render() {
        return (
            <Consumer>
                {(state) => {
                    if (!state.name) { return null }
                    const connections = state.modules.reduce((c, m) => {
                        m.inputs.forEach((port) => {
                            if (!port.connected) { return }
                            c.push([port.sourceId, port.id])
                        })
                        return c
                    }, [])
                    return (
                        <div className="Canvas">
                            <h1>{state.name}</h1>
                            <div className="Nodes" ref={this.update}>
                                {state.modules.map((m) => (
                                    <div
                                        className="Module"
                                        style={{
                                            top: m.layout.position.top,
                                            left: m.layout.position.left,
                                            width: m.layout.width,
                                            height: m.layout.height,
                                        }}
                                    >
                                        <div className="moduleHeader">
                                            <div className="name">{m.name}</div>
                                        </div>
                                        <div className="portsContainer">
                                            <div className="ports inputs">
                                                {m.inputs.map((port) => (
                                                    <Port key={port.id} {...port} onRef={this.getOnPort(port)} />
                                                ))}
                                            </div>
                                            <div className="ports outputs">
                                                {m.outputs.map((port) => (
                                                    <Port key={port.id} {...port} onRef={this.getOnPort(port)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <svg
                                className="Connections"
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
                                            className="Connection"
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
                    )
                }}
            </Consumer>
        )
    }
}

