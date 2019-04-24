/* eslint-disable react/no-unused-state */

import React from 'react'
import cx from 'classnames'
import ResizerContext from './Context'
import styles from './resizer.pcss'

class Resizer extends React.Component {
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
        // capture current actual width
        const el = this.props.target.current
        const rect = el.getBoundingClientRect()
        el.style.width = `${rect.width}px`
        el.style.height = `${rect.height}px`
        el.style.minWidth = ''
        el.style.minHeight = ''
        this.setState({
            initX: clientX,
            initY: clientY,
            initWidth: rect.width,
            initHeight: rect.height,
        })
    }

    /**
     * Update temp size state.
     */

    updateSize = ({ clientX, clientY }, done) => {
        const el = this.props.target.current
        const diffX = this.state.initX - clientX
        const diffY = this.state.initY - clientY
        const width = Math.max(this.props.minWidth, this.state.initWidth - diffX)
        const height = Math.max(this.props.minHeight, this.state.initHeight - diffY)
        el.style.width = `${width}px`
        el.style.height = `${height}px`

        this.setState({
            diffX,
            diffY,
        }, done)
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
            minWidth,
            minHeight,
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

export default (props) => (
    <ResizerContext.Consumer>
        {({ minWidth, minHeight }) => (
            <Resizer {...props} minWidth={minWidth} minHeight={minHeight} />
        )}
    </ResizerContext.Consumer>
)
