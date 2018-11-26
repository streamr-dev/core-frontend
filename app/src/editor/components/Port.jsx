/* eslint-disable react/no-unused-state */
import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import { DragSource, DropTarget } from '../utils/dnd'
import { DragTypes } from '../state'

import styles from './Module.pcss'

class Port extends React.PureComponent {
    state = {
        hasFocus: false,
    }

    static getDerivedStateFromProps({ port }, { hasFocus }) {
        if (hasFocus) { return null }
        let value = port.value || port.defaultValue
        if (value == null) { value = '' } // react isn't happy if input value is undefined/null
        return { value }
    }

    onRef = (el) => {
        this.props.onPort(this.props.port.id, el)
    }

    onChange = (event) => {
        const { value } = event.target
        this.setState({ value })
        this.props.adjustMinPortSize(String(value).length)
    }

    onFocus = () => {
        this.setState({
            hasFocus: true,
        })
    }

    onBlur = () => {
        this.props.onChange(this.props.port.id, this.state.value)
        this.setState({
            hasFocus: false,
        })
    }

    toggleOption = (key) => () => {
        const { port } = this.props
        this.props.setPortOptions(port.id, { [key]: !port[key] })
    }

    render() {
        const { port, ...props } = this.props
        const isInput = !!port.acceptedTypes
        const isParam = 'defaultValue' in port
        const portContent = [
            <div
                role="gridcell"
                key={`${port.id}.name`}
                className={cx(styles.portName, {
                    [styles.isInput]: isInput,
                    [styles.isOutput]: !isInput,
                })}
            >
                {port.displayName || startCase(port.name)}
            </div>,
            <div key={`${port.id}.icon`} className={styles.portIconContainer} role="gridcell">
                {props.connectDragSource(props.connectDropTarget((
                    <div
                        ref={this.onRef}
                        title={port.id}
                        className={cx(styles.portIcon, {
                            [styles.isInput]: isInput,
                            [styles.isOutput]: !isInput,
                            [styles.dragInProgress]: props.itemType,
                            [styles.dragPortInProgress]: props.itemType === DragTypes.Port,
                            [styles.dragModuleInProgress]: props.itemType === DragTypes.Module,
                            [styles.isDragging]: props.isDragging,
                            [styles.connected]: port.connected,
                            [styles.canDrop]: props.canDrop,
                            [styles.isOver]: props.isOver,
                            [styles.requiresConnection]: port.requiresConnection,
                            [styles.drivingInput]: port.drivingInput,
                            [styles.noRepeat]: port.noRepeat,
                        })}
                    >
                        <div className={styles.portOptions}>
                            {port.canToggleDrivingInput && (
                                <button
                                    type="button"
                                    title={`Driving Input: ${port.drivingInput ? 'On' : 'Off'}`}
                                    value={!!port.drivingInput}
                                    className={styles.drivingInputOption}
                                    onClick={this.toggleOption('drivingInput')}
                                >
                                    DI
                                </button>
                            )}
                            {port.canHaveInitialValue && (
                                <button
                                    type="button"
                                    title={`Initial Value: ${port.initialValue !== '' ? port.initialValue : '(None)'}`}
                                    value={port.initialValue !== ''}
                                    className={styles.initialValueOption}
                                    onClick={this.toggleOption('initialValue')}
                                >
                                    IV
                                </button>
                            )}
                            {port.canBeNoRepeat && (
                                <button
                                    type="button"
                                    title={`No Repeat: ${port.drivingInput ? 'On' : 'Off'}`}
                                    value={!!port.noRepeat}
                                    className={styles.noRepeatOption}
                                    onClick={this.toggleOption('noRepeat')}
                                >
                                    NR
                                </button>
                            )}
                        </div>
                    </div>
                )))}
            </div>,
        ]

        if (isInput) {
            /* flip icon/name order */
            portContent.reverse()
        }

        if (isParam) {
            const portSize = this.props.size + 2 // add some padding
            /* add input for params */
            portContent.push((
                <div key={`${port.id}.value`} className={cx(styles.portValueContainer)} role="gridcell">
                    {port.possibleValues ? (
                        /* Select */
                        <select
                            className={styles.portValue}
                            value={this.state.value}
                            onChange={this.onChange}
                            disabled={!!port.connected}
                            onMouseOver={() => this.props.setIsDraggable(false)}
                            onMouseOut={() => this.props.setIsDraggable(true)}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                            style={{
                                // setting minWidth allows size transition
                                minWidth: `${portSize}ch`,
                            }}
                        >
                            {port.possibleValues.map(({ name, value }) => (
                                <option key={value} value={value}>{name}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className={styles.portValue}
                            value={this.state.value}
                            disabled={!!port.connected}
                            onChange={this.onChange}
                            size={portSize}
                            style={{
                                // setting minWidth allows size transition
                                minWidth: `${portSize}ch`,
                            }}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                            onMouseOver={() => this.props.setIsDraggable(false)}
                            onMouseOut={() => this.props.setIsDraggable(true)}
                        />
                    )}
                </div>
            ))
        } else if (isInput) {
            /* placeholder div for consistent icon vertical alignment */
            portContent.push((
                <div key={`${port.id}.value`} className={cx(styles.portValueContainer)} role="gridcell">
                    <div
                        className={styles.portValue}
                    />
                </div>
            ))
        }

        return portContent
    }
}

const PortDrag = DragSource(DragTypes.Port)
const PortDrop = DropTarget(DragTypes.Port)

export default PortDrag(PortDrop(Port))
