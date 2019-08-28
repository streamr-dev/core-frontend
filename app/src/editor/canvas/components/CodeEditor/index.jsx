import React, { useState, useCallback, useContext, useRef, useEffect } from 'react'
import debounce from 'lodash/debounce'

import CodeEditorWindow from './CodeEditorWindow'
import { CanvasWindowContext } from '../CanvasWindow'
import DebugWindow from './DebugWindow'
import { useLayoutState } from '$editor/canvas/components/DraggableCanvasWindow'

/**
 * Sets position to center of container once.
 * Will recenter if window is resized.
 */

function useInitToCenter({ containerRef, width, height, setPosition }) {
    const isInitializedRef = useRef(false)
    const initToCenter = useCallback(() => {
        if (isInitializedRef.current) { return }
        const { current: container } = containerRef
        if (!container) { return }
        isInitializedRef.current = true
        const rect = container.getBoundingClientRect()
        setPosition([
            (rect.width / 2) - (width / 2),
            (rect.height / 2) - (height / 2),
        ])
    }, [containerRef, width, height, setPosition, isInitializedRef])

    const onResize = useCallback(debounce(() => {
        if (!isInitializedRef.current) { return }
        // reset position to center after resize window
        isInitializedRef.current = false
        initToCenter()
    }, 300), [isInitializedRef, initToCenter])

    const onResizeRef = useRef()

    useEffect(() => {
        if (onResizeRef.current && onResize !== onResizeRef.current) {
            onResizeRef.current.cancel()
        }
        onResizeRef.current = onResize
        window.addEventListener('resize', onResize)
        return () => {
            onResize.cancel()
            window.removeEventListener('resize', onResize)
        }
    }, [onResize, onResizeRef])

    return initToCenter
}

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

    const initEditorToCenter = useInitToCenter({
        containerRef: canvasWindowElRef,
        width: editorLayout.size[0],
        height: editorLayout.size[1],
        setPosition: editorLayout.setPosition,
    })

    const initDebugToCenter = useInitToCenter({
        containerRef: canvasWindowElRef,
        width: debugLayout.size[0],
        height: debugLayout.size[1],
        setPosition: debugLayout.setPosition,
    })

    const onShowEditor = useCallback(() => {
        initEditorToCenter()
        setEditorOpen(true)
    }, [setEditorOpen, initEditorToCenter])

    const onCloseEditor = useCallback(() => {
        setEditorOpen(false)
    }, [setEditorOpen])

    const onShowDebug = useCallback(() => {
        initDebugToCenter()
        setDebugOpen(true)
    }, [setDebugOpen, initDebugToCenter])

    const onCloseDebug = useCallback(() => {
        setDebugOpen(false)
    }, [setDebugOpen])

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
