import React from 'react'
import Draggable from 'react-draggable'

import SvgIcon from '$shared/components/SvgIcon'
import CanvasWindow from './CanvasWindow'

import styles from './CodeEditorWindow.pcss'

class DebugWindow extends React.Component {
    state = {
        messages: this.props.messages,
    }

    render() {
        const { messages } = this.state
        const { onClose } = this.props

        return (
            <CanvasWindow>
                <Draggable
                    handle={`.${styles.editorTitle}`}
                >
                    <div className={styles.editorDialog}>
                        <div className={styles.editorTitleContainer}>
                            <div className={styles.editorTitle}>
                                Debug Messages
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.closeButton}
                            >
                                <SvgIcon name="crossHeavy" />
                            </button>
                        </div>
                        <div className={styles.editorContainer}>
                            {JSON.stringify(messages)}
                        </div>
                        <div className={styles.editorToolbar}>
                            <button
                                type="button"
                                onClick={this.onApply}
                                className={styles.toolbarButton}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.toolbarButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Draggable>
            </CanvasWindow>
        )
    }
}

export default DebugWindow
