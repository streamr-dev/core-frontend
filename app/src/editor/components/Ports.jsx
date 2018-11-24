/* eslint-disable react/no-unused-state */
import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import { DragSource, DropTarget } from '../utils/dnd'
import { DragTypes, RunStates } from '../state'

import styles from './Ports.pcss'

class PortComponent extends React.PureComponent {
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

    onChange = (value) => {
        this.props.adjustMinPortSize(String(value).length)
        this.setState({ value })
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
        const { port, canvas, ...props } = this.props
        const isInput = !!port.acceptedTypes
        const isParam = 'defaultValue' in port
        const isRunning = canvas.state === RunStates.Running
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
                                    disabled={!!isRunning}
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
                                    disabled={!!isRunning}
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
                                    disabled={!!isRunning}
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
            /* add input for params */
            portContent.push((
                <div key={`${port.id}.value`} className={cx(styles.portValueContainer)} role="gridcell">
                    <PortParam
                        className={styles.portValue}
                        port={port}
                        size={this.props.size}
                        value={this.state.value}
                        onChange={this.onChange}
                        disabled={!!port.connected || !!isRunning}
                        onMouseOver={() => this.props.setIsDraggable(false)}
                        onMouseOut={() => this.props.setIsDraggable(true)}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                    />
                </div>
            ))
        } else if (isInput) {
            /* placeholder div for consistent icon vertical alignment */
            portContent.push((
                <div key={`${port.id}.value`} className={cx(styles.portValueContainer)} role="gridcell">
                    <div className={styles.portValue} />
                </div>
            ))
        }

        return portContent
    }
}

function MinusIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="2" {...props}>
            <g fill="none" fillRule="evenodd">
                <path stroke="currentColor" strokeLinecap="round" d="M7.2 1H.8" />
            </g>
        </svg>
    )
}

function PlusIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" {...props}>
            <g fill="none" fillRule="evenodd">
                <g stroke="currentColor" strokeLinecap="round">
                    <path d="M4 .8v6.4M7.2 4H.8" />
                </g>
            </g>
        </svg>
    )
}

class MapParam extends React.Component {
    state = {
        values: undefined,
    }

    buttonRefs = []
    keyRefs = []

    static getDerivedStateFromProps(props, state) {
        if (state.values) {
            return null
        }
        return {
            values: Object.entries(props.value),
        }
    }

    getOnChange = (type, index) => (event, done) => {
        const { value } = event.target
        return this.onChange(type, index, value, done)
    }

    onChange = (type, index, value, done) => {
        this.setState(({ values }) => {
            const newValues = values.slice()
            const prev = newValues[index] || ['', '']
            newValues[index] = type === 'key' ? [value, prev[1]] : [prev[0], value]
            return {
                values: newValues,
            }
        }, () => {
            if (typeof done === 'function') {
                done()
            }
            this.props.onChange(this.getValue())
        })
    }

    getValue = () => (
        // convert values k/v array to an Object
        this.state.values.filter(([key = '']) => (
            key.trim() // remove any rows with an empty key
        )).reduce((o, [key, value = '']) => Object.assign(o, {
            [key.trim()]: value.trim(),
        }), {})
    )

    getOnFocus = (type, index) => (event) => {
        event.target.select() // select all input text on focus
        // set field to single space to trigger new empty row
        // user will not see the space
        const kv = this.state.values[index] || ['', '']
        this.onChange(type, index, kv[type === 'key' ? 0 : 1])
        this.props.onFocus(event)
    }

    getRemoveRow = (index) => () => {
        this.setState(({ values }) => {
            const newValues = values.slice()
            newValues[index] = false
            return {
                values: newValues.filter(Boolean),
            }
        })
    }

    getAddRow = (index) => () => {
        const el = this.keyRefs[index]
        if (el) { el.focus() }
    }

    getButtonRef = (index) => (el) => {
        this.buttonRefs[index] = el
    }

    getKeyRef = (index) => (el) => {
        this.keyRefs[index] = el
    }

    render() {
        const { values } = this.state
        const minWidth = 4
        const valuesWithAdder = values.slice()
        valuesWithAdder.push(['', ''])
        const lastIndex = valuesWithAdder.length - 1
        return (
            <div className={cx(styles.mapParam)}>
                {valuesWithAdder.map(([key, value], index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={index}>
                        <input
                            className={cx(styles.mapParamKey, styles.portValue)}
                            placeholder="key"
                            value={key}
                            size={`${minWidth}`}
                            onChange={this.getOnChange('key', index)}
                            onFocus={this.getOnFocus('key', index)}
                            onBlur={this.props.onBlur}
                            ref={this.getKeyRef(index)}
                        />
                        <input
                            className={cx(styles.mapParamValue, styles.portValue)}
                            placeholder="value"
                            value={value}
                            size={`${minWidth}`}
                            onChange={this.getOnChange('value', index)}
                            onFocus={this.getOnFocus('value', index)}
                            onBlur={this.props.onBlur}
                        />
                        {(index !== lastIndex) ? (
                            <button
                                type="button"
                                onClick={this.getRemoveRow(index)}
                                ref={this.getButtonRef(index)}
                            >
                                <MinusIcon />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={this.getAddRow(index)}
                                ref={this.getButtonRef(index)}
                            >
                                <PlusIcon />
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
        )
    }
}

function PortParam({ port, size, onChange, ...props }) {
    // normalize onChange to always return new value rather than an event
    const onChangeEvent = (event) => onChange(event.target.value)

    const portSize = size + 2 // add some padding

    const style = {
        minWidth: `${portSize}ch`, // setting minWidth allows size transition
    }

    if (port.type === 'Map') {
        return (
            <MapParam
                {...{
                    port,
                    size,
                    ...props,
                }}
                onChange={onChange}
            />
        )
    }

    /* Select */
    if (port.possibleValues) {
        return (
            <select {...props} onChange={onChangeEvent} style={style}>
                {port.possibleValues.map(({ name, value }) => (
                    <option key={value} value={value}>{name}</option>
                ))}
            </select>
        )
    }

    return (
        <input {...props} onChange={onChangeEvent} style={style} />
    )
}

const PortDrag = DragSource(DragTypes.Port)
const PortDrop = DropTarget(DragTypes.Port)

const Port = PortDrag(PortDrop(PortComponent))

// this is the `display: table` equivalent of `<td colspan="3" />`. For alignment.
const PortPlaceholder = () => <React.Fragment><div /><div /><div /></React.Fragment>

export default class Ports extends React.Component {
    state = {
        minPortSize: 0,
    }

    // for resizing all port widths to match longest port value
    adjustMinPortSize = (minPortSize) => {
        this.setState({ minPortSize })
    }

    render() {
        const { api, module, canvas } = this.props
        const { outputs } = module

        const inputs = module.params.concat(module.inputs)

        // map inputs and outputs into visual rows
        const rows = []
        const maxRows = Math.max(inputs.length, outputs.length)
        for (let i = 0; i < maxRows; i += 1) {
            rows.push([inputs[i], outputs[i]])
        }

        const portSize = Math.min(module.params.reduce((size, { value, defaultValue }) => (
            Math.max(size, String(value || defaultValue).length)
        ), Math.max(4, this.state.minPortSize)), 40)

        // this is the `display: table` equivalent of `<td colspan="3" />`. For alignment.

        return (
            <div className={styles.ports}>
                {rows.map((ports) => (
                    <div key={ports.map((p) => p && p.id).join(',')} className={styles.portRow} role="row">
                        {ports.map((port, index) => (
                            /* eslint-disable react/no-array-index-key */
                            !port ? <PortPlaceholder key={index} /> /* placeholder for alignment */ : (
                                <Port
                                    key={port.id + index}
                                    port={port}
                                    onPort={this.props.onPort}
                                    size={portSize}
                                    adjustMinPortSize={this.adjustMinPortSize}
                                    setIsDraggable={this.props.setIsDraggable}
                                    canvas={canvas}
                                    {...api.port}
                                />
                            )
                            /* eslint-enable react/no-array-index-key */
                        ))}
                    </div>
                ))}
            </div>
        )
    }
}

