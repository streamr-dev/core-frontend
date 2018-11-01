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
    initialState = {
        diffX: 0,
        diffY: 0,
        initX: 0,
        initY: 0,
        initWidth: 0,
        initHeight: 0,
    }

    state = this.initialState

    onMouseDown = (event) => {
        if (!this.props.target.current) { return }
        event.stopPropagation()
        // attach to window to ensure 'release outside' is detected
        window.addEventListener('mouseup', this.onMouseUp)
        window.addEventListener('mousemove', this.onDragMove)
        document.body.addEventListener('keydown', this.onKeyDown)
        document.body.style.cursor = 'nwse-resize' // force resize cursor for duration of drag

        this.props.onResizing(true)

        // capture current actual width
        const rect = this.props.target.current.getBoundingClientRect()
        this.setState({
            initX: event.clientX,
            initY: event.clientY,
            initWidth: rect.width,
            initHeight: rect.height,
        })
    }

    onKeyDown = (event) => {
        if (event.key === 'Escape') {
            this.onDragCancel(event)
        }
    }

    onDragCancel = (event) => {
        event.stopPropagation()
        this.props.onResizing(false)

        // reset -> update noop
        this.setState(this.initialState)
        this.onMouseUp(event)
    }

    onMouseUp = (event) => {
        event.stopPropagation()
        window.removeEventListener('mouseup', this.onMouseUp)
        window.removeEventListener('mousemove', this.onDragMove)
        document.body.removeEventListener('keydown', this.onKeyDown)
        document.body.style.cursor = ''

        this.props.onResizing(false)

        // only commit change after cancel
        if (!this.state.diffX && !this.state.diffY) { return } // noop if no change
        this.props.api.updateModuleSize(this.props.module.hash, {
            width: this.state.initWidth - this.state.diffX,
            height: this.state.initHeight - this.state.diffY,
        })

        this.setState(this.initialState) // reset
    }

    onDragMove = (event) => {
        this.updateSize(event)
    }

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
