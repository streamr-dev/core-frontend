// @flow

import React, { useCallback, useState, useEffect, useContext } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import EditableText from '$shared/components/EditableText'
import { DragDropContext } from '../../DragDropContext'
import Option from '../Option'
import Plug from '../Plug'
import Menu from '../Menu'
import Value from '../Value'
import Cell from './Cell'
import styles from './port.pcss'

type Props = {
    api: any,
    canvas: any,
    onPort: any,
    onValueChange: (any, any, any) => void,
    onSizeChange: () => void,
    port: any,
    setOptions: any,
}

const Port = ({
    api,
    canvas,
    onPort,
    onSizeChange,
    onValueChange: onValueChangeProp,
    port,
    setOptions,
}: Props) => {
    const isRunning = canvas.state === 'RUNNING'
    const isInput = !!port.acceptedTypes
    const isParam = 'defaultValue' in port
    const hasInputField = isParam || port.canHaveInitialValue
    const [contextMenuTarget, setContextMenuTarget] = useState(null)
    const [editingName, setEditingName] = useState(false)

    const onContextMenu = useCallback((e: SyntheticMouseEvent<EventTarget>) => {
        e.preventDefault()
        // $FlowFixMe wtf?
        setContextMenuTarget(e.currentTarget)
    }, [setContextMenuTarget])

    const dismiss = useCallback(() => {
        setContextMenuTarget(null)
    }, [])

    const onWindowMouseDown = useCallback((e: SyntheticMouseEvent<EventTarget>) => {
        if (contextMenuTarget && e.target instanceof Element) {
            if (e.target.classList.contains(Menu.styles.noAutoDismiss)) {
                return
            }

            if (!contextMenuTarget.contains(e.target)) {
                dismiss()
            }
        }
    }, [contextMenuTarget, dismiss])

    const onWindowBlur = useCallback(() => {
        const { activeElement } = document
        if (contextMenuTarget && activeElement && activeElement.tagName.toLowerCase() === 'iframe') {
            dismiss()
        }
    }, [contextMenuTarget, dismiss])

    const onGlobalKeyDown = useCallback(({ key }: SyntheticKeyboardEvent<EventTarget>) => {
        if (contextMenuTarget && key === 'Escape') {
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

    const { isDragging, data } = useContext(DragDropContext)
    const { portId } = data || {}
    const dragInProgress = !!isDragging && portId != null

    const plug = (
        <Plug
            api={api}
            canvas={canvas}
            onContextMenu={onContextMenu}
            onValueChange={onValueChangeProp}
            port={port}
            register={onPort}
        />
    )

    useEffect(() => {
        window.addEventListener('mousedown', onWindowMouseDown)
        window.addEventListener('keydown', onGlobalKeyDown)
        window.addEventListener('blur', onWindowBlur)

        return () => {
            window.removeEventListener('mousedown', onWindowMouseDown)
            window.removeEventListener('keydown', onGlobalKeyDown)
            window.removeEventListener('blur', onWindowBlur)
        }
    }, [onWindowMouseDown, onGlobalKeyDown, onWindowBlur])

    useEffect(() => {
        onSizeChange()
    }, [port.value, onSizeChange])

    return (
        <div
            className={cx(styles.root, {
                [styles.dragInProgress]: !!dragInProgress,
            })}
        >
            {!!contextMenuTarget && (
                <Menu
                    api={api}
                    dismiss={dismiss}
                    port={port}
                    setPortOptions={setOptions}
                    target={contextMenuTarget}
                />
            )}
            {!!port.canToggleDrivingInput && (
                <Option
                    activated={!!port.drivingInput}
                    className={styles.portOption}
                    disabled={!!isRunning}
                    name="drivingInput"
                    onToggle={onOptionToggle}
                />
            )}
            {!isInput ? (
                <Cell className={styles.spaceholder} />
            ) : plug}
            <Cell>
                <EditableText
                    disabled={!!isRunning}
                    editing={editingName}
                    onChange={onNameChange}
                    setEditing={setEditingName}
                >
                    {port.displayName || startCase(port.name)}
                </EditableText>
            </Cell>
            {!!hasInputField && (
                <Cell>
                    <Value
                        canvas={canvas}
                        port={port}
                        onChange={onValueChange}
                    />
                </Cell>
            )}
            {!isInput && plug}
            {!!port.canBeNoRepeat && (
                <Option
                    activated={!!port.noRepeat}
                    className={styles.portOption}
                    disabled={!!isRunning}
                    name="noRepeat"
                    onToggle={onOptionToggle}
                />
            )}
        </div>
    )
}

Port.styles = styles

export default Port
