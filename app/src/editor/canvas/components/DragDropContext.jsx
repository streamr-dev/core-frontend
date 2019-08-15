/* eslint-disable react/no-unused-state */
import React from 'react'
import Draggable from 'react-draggable'

const DragDropContext = React.createContext({})

export { DragDropContext }

export class DragDropProvider extends React.PureComponent {
    moveListeners = new Set()

    initialState = {
        isDragging: false,
        isCancelled: undefined,
        diff: undefined,
        data: {},
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (!this.state.isDragging) { return }
        // all keyboard events should be swallowed while dragging
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        if (event.key === 'Escape') {
            this.onCancel()
        }
    }

    onDrag = (diff) => {
        if (this.state.isCancelled) { return false }
        // don't setState to avoid rerendering entire context on each mouse move
        this.diff = diff
        this.moveListeners.forEach((fn) => {
            fn(diff)
        })
    }

    getDiff = () => (
        this.diff
    )

    onMove = (fn) => {
        this.moveListeners.add(fn)
    }

    offMove = (fn) => {
        this.moveListeners.delete(fn)
    }

    onStart = (data) => {
        if (this.unmounted) { return }
        if (data === false) { return false }

        this.diff = {
            x: 0,
            y: 0,
        }

        this.setState({
            ...this.initialState,
            isCancelled: false,
            isDragging: true,
            data,
        })
    }

    onStop = () => {
        if (this.unmounted) { return }
        this.setState(this.initialState)
    }

    onCancel = () => {
        if (this.unmounted) { return }
        this.setState({
            ...this.initialState,
            isCancelled: true,
        })
    }

    updateData = (newData) => {
        if (this.unmounted) { return }
        this.setState(({ data }) => ({
            data: {
                ...data,
                ...newData,
            },
        }))
    }

    state = {
        ...this.initialState,
        onStart: this.onStart,
        onMove: this.onMove,
        offMove: this.offMove,
        onDrag: this.onDrag,
        onStop: this.onStop,
        getDiff: this.getDiff,
        updateData: this.updateData,
    }

    render() {
        return (
            <DragDropContext.Provider value={this.state}>
                {this.props.children || null}
            </DragDropContext.Provider>
        )
    }
}

function isSamePosition(a = {}, b = {}) {
    return a.x === b.x && a.y === b.y
}

class EditorDraggable extends React.PureComponent {
    static contextType = DragDropContext

    state = {
        position: undefined,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    getDiff(data) {
        const initialPosition = this.initialPosition || this.state.initialPosition

        return {
            x: data.x - initialPosition.x,
            y: data.y - initialPosition.y,
        }
    }

    static getDerivedStateFromProps({ defaultPosition }, state) {
        const defaultPositionIsSame = isSamePosition(defaultPosition, state.lastDefaultPosition)
        if (!state.defaultPositionChanged && defaultPositionIsSame) {
            return null
        }

        return {
            defaultPositionChanged: !defaultPositionIsSame,
            lastDefaultPosition: defaultPosition,
        }
    }

    onStart = (event, data) => {
        if (this.unmounted) { return }
        this.initialPosition = data
    }

    onStop = (event, data) => {
        if (this.unmounted) {
            this.context.onStop()
            return
        }

        if (this.context.isCancelled) {
            this.setState({
                initialPosition: undefined,
            })
            return
        }

        if (this.props.onStop) {
            this.props.onStop(event, {
                diff: this.getDiff(data),
                ...data,
            }, this.reset)
        }

        if (this.unmounted) {
            this.context.onStop()
            return
        }

        this.setState({
            // ensure this happens after props.onStop
            // so reset can file in onStop
            initialPosition: undefined,
        })

        return this.context.onStop()
    }

    onDrag = (event, data) => {
        if (this.unmounted) { return false }
        // do nothing if cancelled
        if (this.context.isCancelled) {
            return false
        }

        const diff = this.getDiff(data)
        // only trigger start after moving
        if (!this.context.isDragging) {
            if (diff.x === 0 && diff.y === 0) {
                return
            }
            this.setState({
                initialPosition: this.initialPosition,
            }, () => {
                this.initialPosition = undefined
            })
            if (!this.props.onStart) {
                const shouldContinue = this.context.onStart()
                if (shouldContinue === false) {
                    return false
                }
            }

            // pass on props.onStart to context
            const startData = this.props.onStart(event, data)
            const shouldContinue = this.context.onStart(startData)
            if (shouldContinue === false) {
                return false
            }
        }

        if (!this.props.onDrag) {
            return this.context.onDrag(diff)
        }

        const shouldContinue = this.props.onDrag(event, data, diff)

        if (!shouldContinue === false) {
            return false
        }

        return this.context.onDrag(diff)
    }

    componentDidUpdate() {
        this.resetStateIfCancelled()
    }

    resetStateIfCancelled() {
        if (this.context.isCancelled) {
            this.reset()
        }
    }

    reset = () => {
        if (this.unmounted) { return }
        if (!this.state.initialPosition) { return }
        // pump initial position to reset draggable
        this.setState({
            position: this.state.initialPosition,
        }, () => {
            if (this.unmounted) { return }
            this.setState({
                position: undefined,
            })
        })
    }

    render() {
        const { defaultPosition } = this.props
        const { defaultPositionChanged } = this.state
        let { position } = this.state

        if (!position && defaultPosition && defaultPositionChanged) {
            position = defaultPosition
        }

        return (
            <Draggable
                {...this.props}
                position={position}
                onStop={this.onStop}
                onStart={this.onStart}
                onDrag={this.onDrag}
            />
        )
    }
}

export { EditorDraggable as Draggable }
