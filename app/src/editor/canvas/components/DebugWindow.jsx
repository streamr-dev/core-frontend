import React from 'react'

import DraggableCanvasWindow from './DraggableCanvasWindow'

import styles from './CodeEditorWindow.pcss'

class DebugWindow extends React.Component {
    state = {
        messages: this.props.messages,
    }

    render() {
        const { messages } = this.state
        const { onClose, position, onPositionUpdate } = this.props

        return (
            <DraggableCanvasWindow
                start={position}
                onPositionUpdate={onPositionUpdate}
            >
                <div className={styles.editorDialog}>
                    <DraggableCanvasWindow.Dialog
                        title="Debug Messages"
                        onClose={onClose}
                    >
                        <div className={styles.editorContainer}>
                            {JSON.stringify(messages)}
                        </div>
                        <DraggableCanvasWindow.Toolbar>
                            <button
                                type="button"
                                onClick={this.onApply}
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
