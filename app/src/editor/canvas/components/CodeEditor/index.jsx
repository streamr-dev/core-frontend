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
    const [editorPosition, setEditorPosition] = useState({
        x: 0,
        y: 0,
    })
    const [debugPosition, setDebugPosition] = useState({
        x: 0,
        y: 0,
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
        setEditorPosition({
            x,
            y,
        })
    }, [setEditorPosition])
    const onDebugPositionUpdate = useCallback((x, y) => {
        setDebugPosition({
            x,
            y,
        })
    }, [setDebugPosition])

    return (
        <React.Fragment>
            {children && children(onShowEditor)}
            {!!editorOpen && (
                <CodeEditorWindow
                    position={editorPosition}
                    onPositionUpdate={onEditorPositionUpdate}
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
                    position={debugPosition}
                    messages={debugMessages}
                    onClear={onClearDebug}
                    onClose={onCloseDebug}
                />
            )}
        </React.Fragment>
    )
}

export default CodeEditor
