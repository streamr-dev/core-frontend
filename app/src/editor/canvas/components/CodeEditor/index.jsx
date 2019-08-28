import React, { useState, useCallback, useContext, useEffect } from 'react'

import { useLayoutState } from '$editor/canvas/components/DraggableCanvasWindow'
import { CanvasWindowContext } from '../CanvasWindow'
import CodeEditorWindow from './CodeEditorWindow'
import DebugWindow from './DebugWindow'
import { useInitToCenter, useInitToPosition } from './useInitPosition'

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
    const canvasWindowElRef = useContext(CanvasWindowContext)
    const editorLayout = useLayoutState()
    const debugLayout = useLayoutState()

    const initEditorPosition = useInitToCenter({
        containerRef: canvasWindowElRef,
        width: editorLayout.size[0],
        height: editorLayout.size[1],
        setPosition: editorLayout.setPosition,
    })

    const offset = 16

    // set debug default position to editor window + offset
    const initDebugPosition = useInitToPosition({
        x: editorLayout.position[0] + offset,
        y: editorLayout.position[1] + offset,
        setPosition: debugLayout.setPosition,
    })

    const onShowEditor = useCallback(() => {
        initEditorPosition()
        setEditorOpen(true)
    }, [setEditorOpen, initEditorPosition])

    const onCloseEditor = useCallback(() => {
        setEditorOpen(false)
    }, [setEditorOpen])

    const onShowDebug = useCallback(() => {
        initEditorPosition() // just in case
        initDebugPosition()
        setDebugOpen(true)
    }, [setDebugOpen, initEditorPosition, initDebugPosition])

    const onCloseDebug = useCallback(() => {
        setDebugOpen(false)
    }, [setDebugOpen])

    useEffect(() => {
        if (debugOpen) { return }
        initDebugPosition(true)
    }, [debugOpen, initDebugPosition])

    return (
        <React.Fragment>
            {children && (typeof children === 'function') && children(onShowEditor)}
            {!!editorOpen && (
                <CodeEditorWindow
                    code={code}
                    readOnly={readOnly}
                    onClose={onCloseEditor}
                    onApply={onApply}
                    onChange={onChange}
                    onShowDebug={onShowDebug}
                    x={editorLayout.position[0]}
                    y={editorLayout.position[1]}
                    width={editorLayout.size[0]}
                    height={editorLayout.size[1]}
                    onChangePosition={editorLayout.setPosition}
                    onChangeSize={editorLayout.setSize}
                />
            )}
            {!!debugOpen && (
                <DebugWindow
                    messages={debugMessages}
                    onClear={onClearDebug}
                    onClose={onCloseDebug}
                    x={debugLayout.position[0]}
                    y={debugLayout.position[1]}
                    width={debugLayout.size[0]}
                    height={debugLayout.size[1]}
                    onChangePosition={debugLayout.setPosition}
                    onChangeSize={debugLayout.setSize}
                />
            )}
        </React.Fragment>
    )
}

export default CodeEditor

export const CodeEditorContainer = () => <div id="canvas-windows" />
