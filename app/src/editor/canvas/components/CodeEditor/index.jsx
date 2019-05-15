import React from 'react'

import CodeEditorWindow from './CodeEditorWindow'
import DebugWindow from './DebugWindow'

export default class CodeEditor extends React.Component {
    state = {
        editorOpen: false,
        debugOpen: false,
        editorPosition: {
            x: 0,
            y: 0,
        },
        debugPosition: {
            x: 0,
            y: 0,
        },
    }

    onShowEditor = () => {
        this.setState({
            editorOpen: true,
        })
    }

    onCloseEditor = () => {
        this.setState({
            editorOpen: false,
        })
    }

    onShowDebug = () => {
        this.setState({
            debugOpen: true,
        })
    }

    onCloseDebug = () => {
        this.setState({
            debugOpen: false,
        })
    }

    onEditorPositionUpdate = (x, y) => {
        this.setState({
            editorPosition: {
                x,
                y,
            },
        })
    }

    onDebugPositionUpdate = (x, y) => {
        this.setState({
            debugPosition: {
                x,
                y,
            },
        })
    }

    render() {
        const {
            readOnly,
            code,
            debugMessages,
            onApply,
            onChange,
            onClearDebug,
            children,
        } = this.props
        const { editorOpen, debugOpen, editorPosition, debugPosition } = this.state

        return (
            <React.Fragment>
                {children && children(this.onShowEditor)}
                {!!editorOpen && (
                    <CodeEditorWindow
                        position={editorPosition}
                        onPositionUpdate={this.onEditorPositionUpdate}
                        code={code}
                        readOnly={readOnly}
                        onClose={this.onCloseEditor}
                        onApply={onApply}
                        onChange={onChange}
                        onShowDebug={this.onShowDebug}
                    />
                )}
                {!!debugOpen && (
                    <DebugWindow
                        onPositionUpdate={this.onDebugPositionUpdate}
                        position={debugPosition}
                        messages={debugMessages}
                        onClear={onClearDebug}
                        onClose={this.onCloseDebug}
                    />
                )}
            </React.Fragment>
        )
    }
}
