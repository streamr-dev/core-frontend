import React, { useState, useCallback } from 'react'

import CodeEditorWindow from './CodeEditorWindow'
import DebugWindow from './DebugWindow'

export const CodeEditor = ({
    children,
    code,
    readOnly,
    onApply,
    onChange,
    debugMessages,
    onClearDebug,
}) => {
    const [editorOpen, setEditorOpen] = useState(false)
    const [debugOpen, setDebugOpen] = useState(false)
    const [editorLayout, setEditorLayout] = useState({
        x: 0,
        y: 0,
        width: 600,
        height: 400,
    })
    const [debugLayout, setDebugLayout] = useState({
        x: 0,
        y: 0,
        width: 600,
        height: 400,
    })
    const onShowEditor = useCallback(() => {
        setEditorOpen(true)
    }, [setEditorOpen])
    const onCloseEditor = useCallback(() => {
        setEditorOpen(false)
    }, [setEditorOpen])
    const onShowDebug = useCallback(() => {
        setDebugOpen(true)
    }, [setDebugOpen])
    const onCloseDebug = useCallback(() => {
        setDebugOpen(false)
    }, [setDebugOpen])
    const onEditorPositionUpdate = useCallback((x, y) => {
        setEditorLayout((layout) => ({
            ...layout,
            x,
            y,
        }))
    }, [setEditorLayout])
    const onEditorSizeUpdate = useCallback((width, height) => {
        setEditorLayout((layout) => ({
            ...layout,
            width,
            height,
        }))
    }, [setEditorLayout])
    const onDebugPositionUpdate = useCallback((x, y) => {
        setDebugLayout((layout) => ({
            ...layout,
            x,
            y,
        }))
    }, [setDebugLayout])
    const onDebugSizeUpdate = useCallback((width, height) => {
        setDebugLayout((layout) => ({
            ...layout,
            width,
            height,
        }))
    }, [setDebugLayout])

    return (
        <React.Fragment>
            {children && children(onShowEditor)}
            {!!editorOpen && (
                <CodeEditorWindow
                    position={{
                        x: editorLayout.x,
                        y: editorLayout.y,
                    }}
                    onPositionUpdate={onEditorPositionUpdate}
                    size={{
                        width: editorLayout.width,
                        height: editorLayout.height,
                    }}
                    onSizeUpdate={onEditorSizeUpdate}
                    code={code}
                    readOnly={readOnly}
                    onClose={onCloseEditor}
                    onApply={onApply}
                    onChange={onChange}
                    onShowDebug={onShowDebug}
                />
            )}
            {!!debugOpen && (
                <DebugWindow
                    onPositionUpdate={onDebugPositionUpdate}
                    position={{
                        x: debugLayout.x,
                        y: debugLayout.y,
                    }}
                    onSizeUpdate={onDebugSizeUpdate}
                    size={{
                        width: debugLayout.width,
                        height: debugLayout.height,
                    }}
                    messages={debugMessages}
                    onClear={onClearDebug}
                    onClose={onCloseDebug}
                />
            )}
        </React.Fragment>
    )
}

export default CodeEditor
