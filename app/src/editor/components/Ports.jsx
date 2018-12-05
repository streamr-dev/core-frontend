/* eslint-disable react/no-unused-state */
import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import { Translate, I18n } from 'react-redux-i18n'

import { DragSource, DropTarget } from '../utils/dnd'
import { DragTypes, RunStates } from '../state'

import styles from './Ports.pcss'

/**
 * Icons
 */

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

/**
 * Single Port Component
 */

const PortDrag = DragSource(DragTypes.Port)
const PortDrop = DropTarget(DragTypes.Port)

const Port = PortDrag(PortDrop(class Port extends React.PureComponent {
    onRef = (el) => {
        this.props.onPort(this.props.port.id, el)
    }

    render() {
        const { port, canvas, ...props } = this.props
        const isInput = !!port.acceptedTypes
        const isParam = 'defaultValue' in port
        const hasInputField = isParam || port.canHaveInitialValue

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
                        <PortOptions port={port} canvas={canvas} setPortOptions={this.props.setPortOptions} />
                    </div>
                )))}
            </div>,
        ]

        if (isInput) {
            /* flip icon/name order */
            portContent.reverse()
        }

        if (hasInputField) {
            /* add input for params/inputs with initial value */
            portContent.push((
                <div key={`${port.id}.value`} className={cx(styles.portValueContainer)} role="gridcell">
                    {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                    <PortValue
                        className={styles.portValue}
                        port={port}
                        canvas={canvas}
                        size={this.props.size}
                        adjustMinPortSize={this.props.adjustMinPortSize}
                        onChange={this.props.onChange}
                        onMouseOver={() => this.props.setIsDraggable(false)}
                        onMouseOut={() => this.props.setIsDraggable(true)}
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
}))

/**
 * Port options flyout menu
 */

class PortOptions extends React.PureComponent {
    getToggleOption = (key) => () => {
        const { port } = this.props
        this.props.setPortOptions(port.id, { [key]: !port[key] })
    }

    render() {
        const { port, canvas } = this.props
        const isRunning = canvas.state === 'RUNNING'
        return (
            <div className={styles.portOptions}>
                {port.canToggleDrivingInput && (
                    <button
                        type="button"
                        title={`${I18n.t('editor.port.drivingInput')}: ${port.drivingInput ? I18n.t('editor.port.on') : I18n.t('editor.port.off')}`}
                        value={!!port.drivingInput}
                        className={styles.drivingInputOption}
                        onClick={this.getToggleOption('drivingInput')}
                        disabled={!!isRunning}
                    >
                        <Translate value="editor.port.drivingInputButton" />
                    </button>
                )}
                {port.canBeNoRepeat && (
                    <button
                        type="button"
                        title={`${I18n.t('editor.port.noRepeat')}: ${port.noRepeat ? I18n.t('editor.port.on') : I18n.t('editor.port.off')}`}
                        value={!!port.noRepeat}
                        className={styles.noRepeatOption}
                        onClick={this.getToggleOption('noRepeat')}
                        disabled={!!isRunning}
                    >
                        <Translate value="editor.port.noRepeatButton" />
                    </button>
                )}
            </div>
        )
    }
}

/**
 * Map-type key/value parameter
 */

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
        if (event.target.select) {
            event.target.select() // select all input text on focus
        }
        // set field to single space to trigger new empty row
        // user will not see the space
        const kv = this.state.values[index] || ['', '']
        this.props.onFocus(event)
        this.onChange(type, index, kv[type === 'key' ? 0 : 1])
    }

    getRemoveRow = (index) => () => {
        // removes key and value at index
        this.setState(({ values }) => {
            const newValues = values.slice()
            newValues[index] = false
            return {
                values: newValues.filter(Boolean),
            }
        }, () => {
            this.props.onChange(this.getValue(), () => {
                this.props.onBlur() // ensures committed to canvas :/
            })
        })
    }

    getAddRow = (index) => () => {
        // doesn't actually add a row, just focus row
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
        const minWidth = 4

        const { values } = this.state
        const rows = values.slice()

        const lastRow = values[values.length - 1]
        // only add a empty row if last row is not empty.
        if (!lastRow || (lastRow[0].trim() || lastRow[1].trim())) {
            rows.push(['', ''])
        }

        const lastIndex = rows.length - 1

        return (
            /* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */
            <div
                className={cx(styles.mapParam)}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
            >
                {rows.map(([key, value], index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={index}>
                        {/* Key Input */}
                        <input
                            className={cx(styles.mapParamKey, styles.portValue)}
                            placeholder={I18n.t('editor.port.key')}
                            value={key}
                            size={`${minWidth}`}
                            onChange={this.getOnChange('key', index)}
                            onFocus={this.getOnFocus('key', index)}
                            onBlur={this.props.onBlur}
                            ref={this.getKeyRef(index)}
                        />
                        {/* Value Input */}
                        <input
                            className={cx(styles.mapParamValue, styles.portValue)}
                            placeholder={I18n.t('editor.port.value')}
                            value={value}
                            size={`${minWidth}`}
                            onChange={this.getOnChange('value', index)}
                            onFocus={this.getOnFocus('value', index)}
                            onBlur={this.props.onBlur}
                        />
                        {/* Add/Remove Button */}
                        {(index !== lastIndex) ? (
                            <button
                                type="button"
                                onClick={this.getRemoveRow(index)}
                                ref={this.getButtonRef(index)}
                                onFocus={this.props.onFocus}
                                onBlur={this.props.onBlur}
                            >
                                <MinusIcon />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={this.getAddRow(index)}
                                ref={this.getButtonRef(index)}
                                onFocus={this.props.onFocus}
                                onBlur={this.props.onBlur}
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

/**
 * Render appropriate control based on port.type
 */

class PortValue extends React.Component {
    state = {
        hasFocus: false,
        value: undefined,
    }

    static getDerivedStateFromProps({ port }, { hasFocus }) {
        if (hasFocus) { return null }
        const isParam = 'defaultValue' in port
        const value = isParam ? (port.value || port.defaultValue) : port.initialValue
        return { value }
    }

    onChange = (value, done) => {
        this.props.adjustMinPortSize(String(value).length)
        this.setState({ value }, done)
    }

    onFocus = (event) => {
        if (event.target.select) {
            event.target.select() // select all input text on focus
        }

        this.setState({
            hasFocus: true,
        })
    }

    onBlur = () => {
        let { value } = this.state
        if (value === '') { value = null }
        this.props.onChange(this.props.port.id, value)
        this.setState({
            hasFocus: false,
        })
    }

    onChangeEvent = (event) => {
        const { value } = event.target
        this.onChange(value)
    }

    render() {
        const {
            canvas,
            port,
            size,
            onChange,
            adjustMinPortSize,
            ...props
        } = this.props

        const isRunning = canvas.state === RunStates.Running
        const disabled = !!(
            isRunning ||
            // enable input whether connected or not if port.canHaveInitialValue
            (!port.canHaveInitialValue && port.connected)
        )

        let { value } = this.state
        if (value == null) {
            value = '' // prevent uncontrolled/controlled switching
        }

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
                        value,
                        ...props,
                    }}
                    disabled={disabled}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
            )
        }

        /* Select */
        if (port.possibleValues) {
            return (
                <select
                    {...props}
                    value={value}
                    disabled={disabled}
                    style={style}
                    onChange={this.onChangeEvent}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                >
                    {port.possibleValues.map(({ name, value }) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
            )
        }

        return (
            <input
                {...props}
                placeholder={port.displayName || port.name}
                value={value}
                disabled={disabled}
                style={style}
                onChange={this.onChangeEvent}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
            />
        )
    }
}

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

        // dynamically size port controls based on largest value
        const portSize = Math.min(module.params.reduce((size, { value, defaultValue }) => (
            Math.max(size, String(value || defaultValue).length)
        ), Math.max(4, this.state.minPortSize)), 40)

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

