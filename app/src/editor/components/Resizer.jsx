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
    }

    state = this.initialState

    componentDidUpdate(prev) {
        if (this.props.target !== prev.target) {
            this.setInitialSize()
        }
    }

    componentDidMount() {
        this.setInitialSize()
    }

    setInitialSize = () => {
        if (!this.props.target) { return }
        const rect = this.props.target.getBoundingClientRect()
        this.props.api.updateModuleSize(this.props.module.hash, {
            width: rect.width,
            height: rect.height,
        })
    }

    onMouseDown = (event) => {
        event.stopPropagation()
        this.props.onResizing(true)
        const { layout } = this.props.module
        this.setState({
            initX: event.screenX,
            initY: event.screenY,
            initWidth: Number.parseInt(layout.width, 10),
            initHeight: Number.parseInt(layout.height, 10),
        })
        // attach to window to ensure 'release outside' is detected
        window.addEventListener('mouseup', this.onMouseUp)
        window.addEventListener('mousemove', this.onDragMove)
        document.body.addEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (event.key === 'Escape') {
            this.onDragCancel(event)
        }
    }

    onDragCancel = (event) => {
        event.stopPropagation()
        this.props.onResizing(false)
        this.setState(this.initialState)
        this.onMouseUp(event)
    }

    onMouseUp = (event) => {
        event.stopPropagation()
        window.removeEventListener('mouseup', this.onMouseUp)
        window.removeEventListener('mousemove', this.onDragMove)
        document.body.removeEventListener('keydown', this.onKeyDown)
        this.props.onResizing(false)
        this.props.api.updateModuleSize(this.props.module.hash, {
            width: this.state.initWidth - this.state.diffX,
            height: this.state.initHeight - this.state.diffY,
        })
        this.setState(this.initialState)
    }

    onDragMove = (event) => {
        this.updateSize(event)
    }

    updateSize = ({ screenX, screenY }, done) => {
        this.setState(({ initX, initY }) => ({
            diffX: initX - screenX,
            diffY: initY - screenY,
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
