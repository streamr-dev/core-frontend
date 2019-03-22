import React from 'react'
import { DraggableCore } from 'react-draggable'

import CanvasWindow from './CanvasWindow'

class DraggableCanvasWindow extends React.Component {
    static defaultProps = {
        start: {
            x: 0,
            y: 0,
        },
    }

    state = {
        // Whether or not we are currently dragging.
        dragging: false,
        // Current transform x and y.
        clientX: this.props.start.x,
        clientY: this.props.start.y,
    }

    onDragStart = () => {
        this.setState({
            dragging: true,
        })
    }

    onDrag = (e, coreEvent) => {
        if (!this.state.dragging) { return false }

        this.setState({
            clientX: this.state.clientX + coreEvent.deltaX,
            clientY: this.state.clientY + coreEvent.deltaY,
        })
    }

    onDragStop = () => {
        if (!this.state.dragging) { return false }

        this.setState({
            dragging: false,
        })
    }

    render() {
        const style = {
            left: this.state.clientX,
            top: this.state.clientY,
        }

        return (
            <CanvasWindow>
                <DraggableCore
                    handle={this.props.handle}
                    onStart={this.onDragStart}
                    onDrag={this.onDrag}
                    onStop={this.onDragStop}
                >
                    {React.cloneElement(React.Children.only(this.props.children), {
                        style,
                    })}
                </DraggableCore>
            </CanvasWindow>
        )
    }
}

export default DraggableCanvasWindow
