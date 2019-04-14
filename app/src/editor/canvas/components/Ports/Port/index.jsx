// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import { DragDropContext } from '../../DragDropContext'
import Option from '../Option'
import Plug from '../Plug'
import styles from './port.pcss'

type Props = {
    api: any,
    canvas: any,
    onChange: any,
    onPort: any,
    port: any,
    setOptions: any,
}

const Port = ({
    api,
    canvas,
    port,
    onPort,
    setOptions,
}: Props) => {
    const isRunning = canvas.state === 'RUNNING'
    const isInput = !!port.acceptedTypes
    const isParam = 'defaultValue' in port
    const hasInputField = isParam || port.canHaveInitialValue
    const plug = (
        <Plug
            api={api}
            canvas={canvas}
            port={port}
            register={onPort}
        />
    )
    const onNameChange = useCallback((displayName) => {
        setOptions(port.id, {
            displayName,
        })
    }, [port.id, setOptions])
    const onOptionToggle = useCallback((key) => {
        setOptions(port.id, {
            [key]: !port[key],
        })
    }, [port.id, setOptions])

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
                            <UseState initialValue={false}>
                                {(editing, setEditing) => (
                                    <EditableText
                                        disabled={!!isRunning}
                                        editing={editing}
                                        onChange={onNameChange}
                                        setEditing={setEditing}
                                    >
                                        {port.displayName || startCase(port.name)}
                                    </EditableText>
                                )}
                            </UseState>
                        </div>
                        {false && hasInputField && (
                            /* add input for params/inputs with initial value */
                            <div className={cx(styles.portValueContainer)}>
                                {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                                {/* <PortValue
                                    className={styles.portValue}
                                    port={port}
                                    canvas={canvas}
                                    onChange={this.props.onChange}
                                /> */}
                            </div>
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
