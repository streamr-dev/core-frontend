import React from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'

import SvgIcon from '$shared/components/SvgIcon'
import CanvasWindow from './CanvasWindow'

import styles from './DraggableCanvasWindow.pcss'

export const Title = ({ children, onClose }) => (
    <div className={styles.titleContainer}>
        <div className={styles.title}>{children}</div>
        <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
        >
            <SvgIcon name="crossHeavy" />
        </button>
    </div>
)

export const Dialog = ({ children, className, onClose, title }) => (
    <div className={cx(styles.dialog, className)}>
        {!!title && (
            <Title onClose={onClose}>{title}</Title>
        )}
        {children}
    </div>
)

export const Toolbar = ({ children, className }) => (
    <div className={cx(styles.toolbar, className)}>
        {children}
    </div>
)

class DraggableCanvasWindow extends React.Component {
    static Dialog = Dialog
    static Title = Title
    static Toolbar = Toolbar

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

        if (this.props.onPositionUpdate) {
            this.props.onPositionUpdate(this.state.clientX, this.state.clientY)
        }
    }

    render() {
        const style = {
            left: this.state.clientX,
            top: this.state.clientY,
        }

        return (
            <CanvasWindow>
                <DraggableCore
                    handle={`.${styles.titleContainer}`}
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
