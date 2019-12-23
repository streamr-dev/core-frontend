// @flow

import React, { useCallback, useState, useEffect, useContext, useMemo, type ComponentType } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import useModule from '$editor/canvas/components/ModuleRenderer/useModule'
import EditableText from '$shared/components/EditableText'
import useGlobalEventWithin from '$shared/hooks/useGlobalEventWithin'
import useKeyDown from '$shared/hooks/useKeyDown'

import { isPortInvisible, isPortRenameDisabled } from '../../../state'
import { DragDropContext } from '../../DragDropContext'
import { useCameraState, noCameraControl } from '../../Camera'
import Option from '../Option'
import Plug from '../Plug'
import Menu from '../Menu'
import Value from '../Value'
import Cell from './Cell'
import styles from './port.pcss'

type Props = {
    onPort: any,
    onValueChange: (any, any, any) => void,
    onSizeChange: () => void,
    port: any,
    setOptions: any,
}

const EMPTY = {}

const Port = ({
    onPort,
    onSizeChange,
    onValueChange: onValueChangeProp,
    port,
    setOptions,
}: Props) => {
    const { isDragging, data } = useContext(DragDropContext)
    const { portId } = data || EMPTY
    const dragInProgress = !!isDragging && portId != null
    const { isCanvasEditable, canvas } = useModule()
    const isContentEditable = !dragInProgress && isCanvasEditable
    const isInput = !!port.acceptedTypes
    const isParam = 'defaultValue' in port
    const hasInputField = !!(isParam || port.canHaveInitialValue)
    const [contextMenuTarget, setContextMenuTarget] = useState(null)
    const [editingName, setEditingName] = useState(false)

    const onContextMenu = useCallback((e: SyntheticMouseEvent<EventTarget>) => {
        e.preventDefault()
        setContextMenuTarget((e.currentTarget: any))
    }, [setContextMenuTarget])

    const dismiss = useCallback(() => {
        setContextMenuTarget(null)
    }, [])

    // close menu on click/wheel/focus outside
    useGlobalEventWithin('mousedown mousewheel focus', useMemo(() => ({
        current: contextMenuTarget,
    }), [contextMenuTarget]), useCallback((within: boolean) => {
        if (!within) {
            dismiss()
        }
    }, [dismiss]), Menu.styles.noAutoDismiss, true)

    const { scale, x, y } = useCameraState()

    // close menu on camera change
    useEffect(() => {
        dismiss()
    }, [dismiss, scale, x, y])

    useKeyDown(useMemo(() => ({
        Escape: () => {
            if (contextMenuTarget) {
                dismiss()
            }
        },
    }), [contextMenuTarget, dismiss]))

    const onWindowBlur = useCallback(() => {
        const { activeElement } = document
        if (contextMenuTarget && activeElement && activeElement.tagName.toLowerCase() === 'iframe') {
            dismiss()
        }
    }, [contextMenuTarget, dismiss])

    const onNameChange = useCallback((displayName) => {
        setOptions(port.id, {
            displayName,
        })
        onSizeChange()
    }, [port.id, setOptions, onSizeChange])

    const onOptionToggle = useCallback((key) => {
        setOptions(port.id, {
            [key]: !port[key],
        })
    }, [port, setOptions])

    const onValueChange = useCallback((value: any, oldValue: any) => {
        onValueChangeProp(port.id, value, oldValue)
        onSizeChange()
    }, [port.id, onValueChangeProp, onSizeChange])

    useEffect(() => {
        window.addEventListener('blur', onWindowBlur)

        return () => {
            window.removeEventListener('blur', onWindowBlur)
        }
    }, [onWindowBlur])

    useEffect(() => {
        onSizeChange()
    }, [port.value, onSizeChange])

    const plug = (
        <Plug
            onContextMenu={onContextMenu}
            onValueChange={onValueChangeProp}
            port={port}
            register={onPort}
            disabled={!isCanvasEditable}
        />
    )

    const isInvisible = isPortInvisible(canvas, port.id)

    const isRenameDisabled = !isContentEditable || isPortRenameDisabled(canvas, port.id)

    return (
        <div
            className={cx(styles.root, {
                [styles.dragInProgress]: !!dragInProgress,
                [styles.isInvisible]: isInvisible,
            })}
        >
            {!!contextMenuTarget && (
                <Menu
                    dismiss={dismiss}
                    port={port}
                    setPortOptions={setOptions}
                    target={contextMenuTarget}
                />
            )}
            {!dragInProgress && !!port.canToggleDrivingInput && (
                <Option
                    activated={!!port.drivingInput}
                    className={styles.portOption}
                    disabled={!isContentEditable}
                    name="drivingInput"
                    onToggle={onOptionToggle}
                />
            )}
            {!isInput ? (
                <Cell className={styles.spaceholder} />
            ) : plug}
            <Cell>
                <EditableText
                    className={styles.name}
                    disabled={!!isRenameDisabled}
                    editing={editingName}
                    onCommit={onNameChange}
                    setEditing={setEditingName}
                >
                    {port.displayName || startCase(port.name)}
                </EditableText>
            </Cell>
            {!!hasInputField && (
                <Cell>
                    <Value
                        className={noCameraControl}
                        port={port}
                        onChange={onValueChange}
                        disabled={!isContentEditable}
                    />
                </Cell>
            )}
            {!isInput && plug}
            {!dragInProgress && !!port.canBeNoRepeat && (
                <Option
                    activated={!!port.noRepeat}
                    className={styles.portOption}
                    disabled={!isContentEditable}
                    name="noRepeat"
                    onToggle={onOptionToggle}
                />
            )}
        </div>
    )
}

export default (React.memo(Port): ComponentType<Props>)
