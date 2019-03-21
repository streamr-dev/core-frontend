import React from 'react'
import AceEditor from 'react-ace'
import Draggable from 'react-draggable'

import 'brace/mode/java'
import 'brace/theme/github'

import SvgIcon from '$shared/components/SvgIcon'
import CanvasWindow from './CanvasWindow'

import styles from './CodeEditorWindow.pcss'

class CodeEditorWindow extends React.Component {
    state = {
        code: this.props.code,
    }

    editor = React.createRef()

    componentDidMount() {
        this.editor.current.editor.focus()
    }

    onChange = (newValue) => {
        this.setState({
            code: newValue,
        })
    }

    onApply = () => {
        this.props.onApply(this.state.code)
    }

    render() {
        const { code } = this.state
        const { onClose, onShowDebug } = this.props

        return (
            <CanvasWindow>
                <Draggable
                    handle={`.${styles.editorTitle}`}
                >
                    <div className={styles.editorDialog}>
                        <div className={styles.editorTitleContainer}>
                            <div className={styles.editorTitle}>
                                Code Editor
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
                            <AceEditor
                                ref={this.editor}
                                value={code}
                                className={styles.editor}
                                mode="java"
                                theme="github"
                                onChange={this.onChange}
                                width="100%"
                                height="100%"
                                maxLines={20}
                                minLines={20}
                                setOptions={{
                                    tabSize: 2,
                                    useSoftTabs: true,
                                }}
                                editorProps={{ $blockScrolling: true }}
                            />
                        </div>
                        <div className={styles.editorToolbar}>
                            <button
                                type="button"
                                onClick={onShowDebug}
                                className={styles.toolbarButton}
                            >
                                Show debug
                            </button>
                            <button
                                type="button"
                                onClick={this.onApply}
                                className={styles.toolbarButton}
                            >
                                Apply
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

export default CodeEditorWindow
