/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'
import styles from './Resizer.pcss'

const RESIZABLE_MODULES = [
    'ChartModule',
    'CommentModule',
    'CustomModule',
    'GaugeModule',
    'HeatmapModule',
    'MapModule',
]

export function isModuleResizable(module) {
    return RESIZABLE_MODULES.includes(module.jsModule)
}

export class Resizer extends React.Component {
    attached = false

    initialState = {
        diffX: 0,
        diffY: 0,
        initX: 0,
        initY: 0,
        initWidth: 0,
        initHeight: 0,
    }

    state = this.initialState

    /**
     * Start Dragging
     */

    onMouseDown = (event) => {
        if (!this.props.target.current) { return }
        event.stopPropagation()
        this.attach()
        this.startDrag(event)
    }

    /**
     * Dragging keyboard controls
     * (esc to cancel)
     */

    onKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation()
            this.cancel()
        }
    }

    /**
     * End & Reset
     */

    onDragCancel = (event) => {
        event.stopPropagation()
        this.cancel()
    }

    /**
     * End & Commit
     */

    onMouseUp = (event) => {
        event.stopPropagation()
        this.detach()
        this.endDrag()
        this.commit()
        this.reset()
    }

    onDragMove = (event) => {
        this.updateSize(event)
    }

    /**
     * Add global listeners & styles
     */

    attach() {
        this.attached = true
        // attach to window to ensure 'release outside' is detected
        window.addEventListener('mouseup', this.onMouseUp)
        window.addEventListener('mousemove', this.onDragMove)
        document.body.addEventListener('keydown', this.onKeyDown)
        document.body.style.cursor = 'nwse-resize' // force resize cursor for duration of drag
        document.body.style.userSelect = 'none' // no text selection while dragging
    }

    /**
     * Remove global listeners & styles
     */

    detach() {
        if (!this.attached) { return }
        this.attached = false
        window.removeEventListener('mouseup', this.onMouseUp)
        window.removeEventListener('mousemove', this.onDragMove)
        document.body.removeEventListener('keydown', this.onKeyDown)
        // restore global styles
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
    }

    /**
     * Commit calculated size changes to module.
     */

    commit() {
        if (!this.state.diffX && !this.state.diffY) { return } // noop if no change
        this.props.api.updateModuleSize(this.props.module.hash, {
            width: this.state.initWidth - this.state.diffX,
            height: this.state.initHeight - this.state.diffY,
        })
    }

    /**
     * Cancel any drag in progress & reset
     */

    cancel() {
        this.detach()
        this.endDrag()
        this.reset()
    }

    /**
     * Reset state
     */

    reset() {
        this.setState(this.initialState)
    }

    /**
     * Capture initial dimensions and click location
     * Tell parent we're resizing
     */

    startDrag({ clientX, clientY }) {
        this.props.onResizing(true)
        // capture current actual width
        const rect = this.props.target.current.getBoundingClientRect()
        this.setState({
            initX: clientX,
            initY: clientY,
            initWidth: rect.width,
            initHeight: rect.height,
        })
    }

    /**
     * Tell parent we're not resizing
     * (Mainly for symmetry with startDrag)
     */

    endDrag() {
        this.props.onResizing(false)
    }

    /**
     * Update temp size state.
     */

    updateSize = ({ clientX, clientY }, done) => {
        this.setState(({ initX, initY }) => ({
            diffX: initX - clientX,
            diffY: initY - clientY,
        }), () => {
            this.props.onAdjustLayout({
                width: this.state.initWidth - this.state.diffX,
                height: this.state.initHeight - this.state.diffY,
            })
            if (typeof done === 'function') {
                done()
            }
        })
    }

    componentWillUnmount() {
        this.cancel()
    }

    render() {
        const {
            target,
            module,
            api,
            className,
            onResizing,
            onAdjustLayout,
            ...props
        } = this.props
        return (
            /* eslint-disable jsx-a11y/no-static-element-interactions */
            <div
                className={cx(className, styles.resizer)}
                onMouseDown={this.onMouseDown}
                {...props}
            />
        )
    }
}
