import React from 'react'
import cx from 'classnames'
import debounce from 'lodash/debounce'

import * as CanvasState from '../state'

import Module from './Module'
import { DragDropProvider } from './DragDropContext'
import Cables from './Cables'

import styles from './Canvas.pcss'

export default class Canvas extends React.PureComponent {
    setPortUserValue = (portId, value, done) => {
        this.props.setCanvas({ type: 'Set Port Value' }, (canvas) => (
            CanvasState.setPortUserValue(canvas, portId, value)
        ), done)
    }

    setPortOptions = (portId, options) => {
        this.props.setCanvas({ type: 'Set Port Options' }, (canvas) => (
            CanvasState.setPortOptions(canvas, portId, options)
        ))
    }

    updateModuleSize = (moduleHash, diff) => {
        this.props.setCanvas({ type: 'Resize Module' }, (canvas) => (
            CanvasState.updateModuleSize(canvas, moduleHash, diff)
        ))
    }

    /**
     * Module & Port Drag/Drop APIs
     * note: don't add state to this as the api object doesn't change
     */

    api = {
        selectModule: (...args) => (
            this.props.selectModule(...args)
        ),
        renameModule: (...args) => (
            this.props.renameModule(...args)
        ),
        moduleSidebarOpen: (...args) => (
            this.props.moduleSidebarOpen(...args)
        ),
        updateModule: (...args) => (
            this.props.updateModule(...args)
        ),
        loadNewDefinition: (...args) => (
            this.props.loadNewDefinition(...args)
        ),
        pushNewDefinition: (...args) => (
            this.props.pushNewDefinition(...args)
        ),
        updateModuleSize: this.updateModuleSize,
        setCanvas: (...args) => (
            this.props.setCanvas(...args)
        ),
        port: {
            onChange: this.setPortUserValue,
            setPortOptions: this.setPortOptions,
        },
    }

    render() {
        const {
            className,
            canvas,
            selectedModuleHash,
            moduleSidebarIsOpen,
            children,
        } = this.props

        return (
            <div className={cx(styles.Canvas, className)}>
                <CanvasElements
                    key={canvas.id}
                    canvas={canvas}
                    api={this.api}
                    selectedModuleHash={selectedModuleHash}
                    moduleSidebarIsOpen={moduleSidebarIsOpen}
                    {...this.api.module}
                />
                {children}
            </div>
        )
    }
}

class CanvasElements extends React.PureComponent {
    ports = new Map()

    state = {
        positions: {},
    }

    componentDidUpdate(prevProps) {
        if (prevProps.canvas === this.props.canvas) { return }
        // force immediate update on canvas change
        // (prevents flickering cables after drag/drop)
        this.updatePositionsNow()
    }

    onFocus = (event) => {
        // deselect + close when clicking canvas
        if (event.target !== event.currentTarget) { return }
        this.props.api.selectModule()
    }

    onPort = (portId, el) => {
        this.ports.set(portId, el)
        this.updatePositions()
    }

    updatePositionsNow = () => {
        if (!this.modules) {
            return
        }

        const offset = this.modules.getBoundingClientRect()
        const positions = [...this.ports.entries()].reduce((r, [id, el]) => {
            if (!el) { return r }
            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) { return r }
            return Object.assign(r, {
                [id]: {
                    id,
                    top: (rect.top - offset.top) + (rect.height / 2),
                    bottom: (rect.bottom - offset.bottom) + (rect.height / 2),
                    left: (rect.left - offset.left) + (rect.width / 2),
                    right: (rect.right - offset.right) + (rect.width / 2),
                    width: rect.width,
                    height: rect.height,
                },
            })
        }, {})

        this.setState({ positions })
    }

    // debounce as many updates will be triggered in quick succession
    // only needs to be done once at the end
    updatePositions = debounce(this.updatePositionsNow)

    modulesRef = (el) => {
        this.modules = el
        this.updatePositions()
    }

    render() {
        const { canvas, api, selectedModuleHash, moduleSidebarIsOpen } = this.props
        if (!canvas) { return null }
        return (
            <div className={styles.CanvasElements}>
                <DragDropProvider>
                    <div
                        className={styles.Modules}
                        onFocus={this.onFocus}
                        ref={this.modulesRef}
                        tabIndex="0"
                        role="grid"
                    >
                        {canvas.modules.map((m) => (
                            <Module
                                key={m.hash}
                                module={m}
                                canvas={canvas}
                                onPort={this.onPort}
                                api={api}
                                selectedModuleHash={selectedModuleHash}
                                moduleSidebarIsOpen={moduleSidebarIsOpen}
                                {...api.module}
                            />
                        ))}
                    </div>
                    <Cables
                        canvas={canvas}
                        positions={this.state.positions}
                        selectedModuleHash={selectedModuleHash}
                    />
                </DragDropProvider>
                <div id="canvas-windows" />
            </div>
        )
    }
}
