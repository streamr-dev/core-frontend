import React from 'react'
import AceEditor from 'react-ace'

import 'brace/mode/java'
import 'brace/theme/textmate'

import DraggableCanvasWindow from '../DraggableCanvasWindow'

import styles from './CodeEditorWindow.pcss'

class CodeEditorWindow extends React.Component {
    state = {
        code: undefined,
        errors: [],
        sending: false,
    }

    editor = React.createRef()

    componentDidMount() {
        this.editor.current.editor.focus()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onChange = (newValue) => {
        this.setState({
            code: newValue,
        })
    }

    onApply = () => {
        this.setState({
            errors: [],
            sending: true,
        }, async () => {
            if (this.unmounted) { return }
            try {
                await this.props.onApply(this.state.code)

                if (this.unmounted) { return }

                this.setState({
                    code: undefined,
                    sending: false,
                })
            } catch (e) {
                if (this.unmounted) { return }
                this.setState({
                    sending: false,
                    errors: e.moduleErrors.reduce((allErrors, o) => ([
                        ...allErrors,
                        ...o.payload.errors.map(({ line, msg }) => ({
                            row: line - 1,
                            column: 1,
                            text: msg,
                            type: 'error',
                        })),
                    ]), []),
                })
            }
        })
    }

    render() {
        const { errors, sending } = this.state
        const {
            onClose,
            onShowDebug,
            readOnly,
            position,
            onPositionUpdate,
        } = this.props

        const code = this.state.code != null ? this.state.code : this.props.code

        return (
            <DraggableCanvasWindow
                start={position}
                onPositionUpdate={onPositionUpdate}
            >
                <div className={styles.editorDialog}>
                    <DraggableCanvasWindow.Dialog
                        title="Code Editor"
                        onClose={onClose}
                    >
                        <div className={styles.editorContainer}>
                            <AceEditor
                                ref={this.editor}
                                value={code}
                                className={styles.editor}
                                mode="java"
                                theme="textmate"
                                onChange={this.onChange}
                                width="100%"
                                height="100%"
                                maxLines={20}
                                minLines={20}
                                setOptions={{
                                    tabSize: 2,
                                    useSoftTabs: true,
                                    tooltipFollowsMouse: false,
                                    useWorker: false,
                                }}
                                annotations={errors}
                                editorProps={{ $blockScrolling: true }}
                                readOnly={readOnly}
                            />
                        </div>
                        <DraggableCanvasWindow.Toolbar>
                            <button
                                type="button"
                                onClick={onShowDebug}
                            >
                                Show debug
                            </button>
                            <button
                                type="button"
                                onClick={this.onApply}
                                disabled={readOnly || sending}
                            >
                                Apply
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

export default CodeEditorWindow
