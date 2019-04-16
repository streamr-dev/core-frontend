// @flow

/* eslint-disable no-unused-vars */

import React, { useCallback, useState, useEffect } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import EditableText from '$shared/components/EditableText'
import { type Ref } from '$shared/flowtype/common-types'
import { DragDropContext } from '../../DragDropContext'
import Option from '../Option'
import Plug from '../Plug'
import Menu from '../Menu'
import Value from '../Value'
import styles from './port.pcss'

type Props = {
    api: any,
    canvas: any,
    onPort: any,
    onValueChange: (any, any) => void,
    port: any,
    setOptions: any,
}

const Port = ({
    api,
    canvas,
    port,
    onPort,
    onValueChange: onValueChangeProp,
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

    const plug = (
        <Plug
            api={api}
            canvas={canvas}
            onContextMenu={onContextMenu}
            port={port}
            register={onPort}
        />
    )

    const dismiss = useCallback(() => {
        setContextMenuTarget(null)
    }, [])

    const onDocumentClick = useCallback((e: SyntheticMouseEvent<EventTarget>) => {
        if (contextMenuTarget && e.target instanceof HTMLElement) {
            if (e.target.classList.contains(Menu.styles.noAutoDismiss)) {
                return
            }

            if (!contextMenuTarget.contains(e.target)) {
                dismiss()
            }
        }
    }, [contextMenuTarget, dismiss])

    const onKeyDown = useCallback(({ key }: SyntheticKeyboardEvent<EventTarget>) => {
        if (contextMenuTarget && key === 'Escape') {
            dismiss()
        }
    }, [contextMenuTarget, dismiss])

    const onNameChange = useCallback((displayName) => {
        setOptions(port.id, {
            displayName,
        })
    }, [port.id, setOptions])

    const onOptionToggle = useCallback((key) => {
        setOptions(port.id, {
            [key]: !port[key],
        })
    }, [port, setOptions])

    const onValueChange = useCallback((value: any) => {
        onValueChangeProp(port.id, value)
    }, [port.id, onValueChangeProp])

    useEffect(() => {
        window.addEventListener('mousedown', onDocumentClick)
        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.addEventListener('mousedown', onDocumentClick)
            window.addEventListener('keydown', onKeyDown)
        }
    }, [onDocumentClick, onKeyDown])

    return (
        <DragDropContext.Consumer>
            {({ isDragging, data }) => {
                const { portId } = data || {}
                const dragInProgress = !!isDragging && portId != null

                return (
                    <div
                        className={cx(styles.root, {
                            [styles.dragInProgress]: !!dragInProgress,
                        })}
                    >
                        {contextMenuTarget && (
                            <Menu
                                api={api}
                                dismiss={dismiss}
                                port={port}
                                setPortOptions={setOptions}
                                target={contextMenuTarget}
                            />
                        )}
                        {port.canToggleDrivingInput && (
                            <Option
                                activated={!!port.drivingInput}
                                className={styles.portOption}
                                disabled={!!isRunning}
                                name="drivingInput"
                                onToggle={onOptionToggle}
                            />
                        )}
                        {!isInput ? (
                            <div className={styles.spaceholder} />
                        ) : plug}
                        <div>
                            <EditableText
                                disabled={!!isRunning}
                                editing={editingName}
                                onChange={onNameChange}
                                setEditing={setEditingName}
                            >
                                {port.displayName || startCase(port.name)}
                            </EditableText>
                        </div>
                        {hasInputField && (
                            <Value
                                canvas={canvas}
                                port={port}
                                onChange={onValueChange}
                            />
                        )}
                        {!isInput && plug}
                        {port.canBeNoRepeat && (
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
            }}
        </DragDropContext.Consumer>
    )
}

Port.styles = styles

export default Port
