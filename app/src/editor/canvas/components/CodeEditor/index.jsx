import React, { useState, useCallback } from 'react'
import { useLayoutState } from '$editor/canvas/components/DraggableCanvasWindow'

import { useCameraContext } from '../Camera'
import CodeEditorWindow from './CodeEditorWindow'
import DebugWindow from './DebugWindow'
import { useInitPosition, useOnResizeEffect } from './useInitPosition'

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
    const camera = useCameraContext()
    const editorLayout = useLayoutState()
    const debugLayout = useLayoutState()

    const initEditorPosition = useInitPosition(useCallback(() => {
        const { scale } = camera
        const center = camera.getCenterWorldPoint()
        const { setPosition } = editorLayout
        setPosition([
            center.x - ((editorLayout.size[0] / 2) * scale),
            center.y - ((editorLayout.size[1] / 2) * scale),
        ])
    }, [editorLayout, camera]))

    // set debug default position to editor window + offset
    const initDebugPosition = useInitPosition(useCallback(() => {
        const { scale } = camera
        const { setPosition } = debugLayout
        const offset = 16 / scale
        setPosition([
            editorLayout.position[0] + offset,
            editorLayout.position[1] + offset,
        ])
    }, [debugLayout, camera, editorLayout]))

    const onShowEditor = useCallback(() => {
        initEditorPosition()
        setEditorOpen((v) => !v) // show === toggle
    }, [setEditorOpen, initEditorPosition])

    const onCloseEditor = useCallback(() => {
        setEditorOpen(false)
    }, [setEditorOpen])

    const onShowDebug = useCallback(() => {
        initEditorPosition() // just in case
        initDebugPosition()
        setDebugOpen((v) => !v) // show === toggle
    }, [setDebugOpen, initEditorPosition, initDebugPosition])

    const onCloseDebug = useCallback(() => {
        setDebugOpen(false)
    }, [setDebugOpen])

    useOnResizeEffect(useCallback(() => {
        const { scale } = camera
        const { setPosition } = debugLayout
        const offset = 16 / scale
        // reset position on resize
        debugLayout.setPosition([
            editorLayout.position[0] + offset,
            editorLayout.position[1] + offset,
        ])
    }, [editorLayout, camera, debugLayout]))

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
