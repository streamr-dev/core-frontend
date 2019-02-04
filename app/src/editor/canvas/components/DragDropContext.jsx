/* eslint-disable react/no-unused-state */
import React from 'react'
import DraggableComponent from 'react-draggable'

const DragDropContext = React.createContext({})

export { DragDropContext }

export class DragDropProvider extends React.PureComponent {
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
        if (this.state.isDragging && event.key === 'Escape') {
            this.onCancel()
        }
    }

    onDrag = (diff) => {
        if (this.state.isCancelled) { return false }
        this.diff = diff
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

    getDiff = () => (
        this.diff
    )

    state = {
        ...this.initialState,
        onStart: this.onStart,
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

class ResettableDraggable extends React.PureComponent {
    state = {}

    onRef = (draggable) => {
        this.draggable = draggable
        if (!draggable) { return }
        // capture initial draggable state for reset hack
        this.initialDraggableState = draggable.state
    }

    reset = () => {
        this.draggable.setState(this.initialDraggableState)
    }

    render() {
        const { defaultPosition } = this.props
        let useDefaultPosition = false
        if (defaultPosition) {
            const { x, y } = defaultPosition
            useDefaultPosition = (this.lastDefaultX !== x || this.lastDefaultY !== y)
            this.lastDefaultX = x
            this.lastDefaultY = y
        }

        return (
            <DraggableComponent
                ref={this.onRef}
                position={useDefaultPosition ? defaultPosition : undefined}
                {...this.props}
            />
        )
    }
}

export class Draggable extends React.PureComponent {
    static contextType = DragDropContext
    componentWillUnmount() {
        this.unmounted = true
    }

    onStart = (event, data) => {
        this.init = data
        if (!this.props.onStart) {
            return this.context.onStart()
        }

        const startData = this.props.onStart(event, data)
        return this.context.onStart(startData)
    }

    onStop = (event, data) => {
        if (this.unmounted) {
            this.context.onStop()
            return false
        }

        const diff = {
            x: data.x - this.init.x,
            y: data.y - this.init.y,
        }

        this.init = undefined

        if (!this.props.onStop) { return }

        this.props.onStop(event, {
            ...data,
            diff,
        })

        return this.context.onStop()
    }

    onDrag = (event, data) => {
        // do nothing if cancelled
        if (this.context.isCancelled) { return false }

        const diff = {
            x: data.x - this.init.x,
            y: data.y - this.init.y,
        }

        if (!this.props.onDrag) {
            return this.context.onDrag(diff)
        }

        const shouldContinue = this.props.onDrag(event, data, diff)

        if (!shouldContinue) { return false }

        return this.context.onDrag(diff) && !this.unmounted
    }

    componentDidUpdate() {
        this.resetStateIfCancelled()
    }

    resetStateIfCancelled() {
        // little hack to reset draggable component state on cancel
        // without resetting the entire component.
        if (this.context.isCancelled && this.draggable) {
            this.draggable.reset()
            return false
        }
    }

    reset = () => {
        if (this.draggable) {
            this.draggable.reset()
        }
    }

    onRef = (draggable) => {
        this.draggable = draggable
        if (!draggable) { return }
        // capture initial draggable state for reset hack
        this.initialDraggableState = draggable.state
    }

    render() {
        return (
            <ResettableDraggable
                {...this.props}
                ref={this.onRef}
                onStop={this.onStop}
                onStart={this.onStart}
                onDrag={this.onDrag}
            />
        )
    }
}
