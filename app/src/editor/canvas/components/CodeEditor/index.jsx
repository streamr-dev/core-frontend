import React, { useState, useCallback } from 'react'

import CodeEditorWindow from './CodeEditorWindow'
import DebugWindow from './DebugWindow'
import useLayoutState from '$editor/shared/hooks/useLayoutState'

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
    const [editorLayout, setEditorSize, setEditorPosition] = useLayoutState()
    const [debugLayout, setDebugSize, setDebugPosition] = useLayoutState()

    const onShowEditor = useCallback(() => {
        setEditorOpen(true)
    }, [])
    const onCloseEditor = useCallback(() => {
        setEditorOpen(false)
    }, [])
    const onShowDebug = useCallback(() => {
        setDebugOpen(true)
    }, [])
    const onCloseDebug = useCallback(() => {
        setDebugOpen(false)
    }, [])

    return (
        <React.Fragment>
            {children && (typeof children === 'function') && children(onShowEditor)}
            {!!editorOpen && (
                <CodeEditorWindow
                    position={editorLayout}
                    onPositionUpdate={setEditorPosition}
                    size={editorLayout}
                    onSizeUpdate={setEditorSize}
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
                    onPositionUpdate={setDebugPosition}
                    position={debugLayout}
                    onSizeUpdate={setDebugSize}
                    size={debugLayout}
                    messages={debugMessages}
                    onClear={onClearDebug}
                    onClose={onCloseDebug}
                />
            )}
        </React.Fragment>
    )
}

export default CodeEditor
