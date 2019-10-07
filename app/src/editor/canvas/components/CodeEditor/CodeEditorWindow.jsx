import React from 'react'
import AceEditor from 'react-ace'
import uniqueId from 'lodash/uniqueId'
import 'brace/mode/java'
import 'brace/theme/textmate'

import DraggableCanvasWindow from '../DraggableCanvasWindow'

import styles from './CodeEditorWindow.pcss'

export default class CodeEditorWindow extends React.Component {
    state = {
        editorResetKey: uniqueId('CodeEditorWindow'),
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

    onChange = (code) => {
        this.setState({
            code,
        })
    }

    onBlur = () => {
        const { code } = this.state
        if (code != null && code !== this.props.code && this.props.onChange) {
            this.props.onChange(code)
        }
        this.setState({
            code: undefined,
            editorResetKey: uniqueId('CodeEditorWindow'),
        })
    }

    onApply = () => {
        this.setState({
            errors: [],
            sending: true,
        }, async () => {
            if (this.unmounted) { return }
            const code = this.state.code != null ? this.state.code : this.props.code
            try {
                if (this.props.onApply) {
                    await this.props.onApply(code)
                }

                if (this.unmounted) { return }

                this.setState({
                    code: undefined,
                    sending: false,
                })
            } catch (e) {
                if (this.unmounted) { return }
                if (!e.moduleErrors) { throw e } // unexpected error
                this.setState({
                    sending: false,
                    errors: e.moduleErrors.map(({ line, message }) => ({
                        row: line - 1,
                        column: 1,
                        text: message,
                        type: 'error',
                    })),
                })
            }
        })
    }

    onClickTitle = (event) => {
        // need to cancel event otherwise editor focus doesn't stick
        event.preventDefault()
        event.stopPropagation()
        // forward title clicks to editor focus
        this.editor.current.editor.focus()
    }

    render() {
        const { editorResetKey, errors, sending } = this.state
        const {
            onClose,
            onShowDebug,
            readOnly,
            code,
            ...canvasWindowProps
        } = this.props

        const content = this.state.code != null ? this.state.code : code

        return (
            <DraggableCanvasWindow {...canvasWindowProps}>
                <div className={styles.editorDialog}>
                    <DraggableCanvasWindow.Dialog onClose={onClose}>
                        <DraggableCanvasWindow.Title onClose={onClose} onClick={this.onClickTitle}>Code Editor</DraggableCanvasWindow.Title>
                        <div className={styles.editorContainer}>
                            <AceEditor
                                ref={this.editor}
                                name={editorResetKey}
                                value={content}
                                className={styles.editor}
                                mode="java"
                                theme="textmate"
                                onChange={this.onChange}
                                onBlur={this.onBlur}
                                width="100%"
                                height="100%"
                                maxLines={Infinity}
                                setOptions={{
                                    tabSize: 2,
                                    useSoftTabs: true,
                                    tooltipFollowsMouse: false,
                                    useWorker: false,
                                }}
                                annotations={errors}
                                editorProps={{ $blockScrolling: true }}
                                readOnly={readOnly || sending}
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
