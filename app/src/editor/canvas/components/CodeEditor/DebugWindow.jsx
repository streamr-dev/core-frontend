import React from 'react'
import cx from 'classnames'

import dateFormatter from '$utils/dateFormatter'
import DraggableCanvasWindow from '../DraggableCanvasWindow'

import windowStyles from './CodeEditorWindow.pcss'
import styles from './DebugWindow.pcss'

class DebugWindow extends React.Component {
    render() {
        const {
            onClose,
            onClear,
            messages,
            position,
            onPositionUpdate,
        } = this.props

        return (
            <DraggableCanvasWindow
                start={position}
                onPositionUpdate={onPositionUpdate}
            >
                <div className={windowStyles.editorDialog}>
                    <DraggableCanvasWindow.Dialog
                        title="Debug Messages"
                        onClose={onClose}
                    >
                        <div className={cx(windowStyles.editorContainer, styles.messages)}>
                            {messages.map((m) => (
                                <div key={m.t}>
                                    {dateFormatter('YYYY-MM-DD HH:mm:ss')(new Date(m.t * 1000))}
                                    &nbsp;
                                    {m.msg}
                                </div>
                            ))}
                        </div>
                        <DraggableCanvasWindow.Toolbar>
                            <button
                                type="button"
                                onClick={onClear}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </DraggableCanvasWindow.Toolbar>
                    </DraggableCanvasWindow.Dialog>
                </div>
            </DraggableCanvasWindow>
        )
    }
}

export default DebugWindow
