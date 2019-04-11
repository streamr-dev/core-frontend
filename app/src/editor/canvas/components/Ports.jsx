/* eslint-disable react/no-unused-state */
import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import UseState from '$shared/components/UseState'
import EditableText from '$shared/components/EditableText'
import ColorPicker from '$editor/shared/components/ColorPicker'
import StreamSelector from '$editor/shared/components/StreamSelector'
import ContextMenu from '$shared/components/ContextMenu'

import {
    RunStates,
    canConnectPorts,
    arePortsOfSameModule,
    hasPort,
    disconnectAllFromPort,
    findLinkedVariadicPort,
    isPortConnected,
} from '../state'
import { DropTarget, DragSource } from './PortDragger'
import { DragDropContext } from './DragDropContext'
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

class PortIcon extends React.PureComponent {
    static contextType = DragDropContext

    state = {
        isMenuOpen: false,
    }

    iconRef = React.createRef()
    unmounted = false

    onRef = (el) => {
        this.props.onPort(this.props.port.id, el)
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.documentClick)
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        this.unmounted = true
        window.removeEventListener('mousedown', this.documentClick)
        window.removeEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (this.state.isMenuOpen && event.key === 'Escape') {
            this.closeContextMenu()
        }
    }

    documentClick = (e) => {
        if (this.iconRef.current != null && !this.iconRef.current.contains(e.target)) {
            this.closeContextMenu()
        }
    }

    openContextMenu = (e) => {
        e.preventDefault()
        if (this.state.isMenuOpen) {
            this.closeContextMenu()
            return
        }

        this.setState({
            isMenuOpen: true,
        })
    }

    closeContextMenu = () => {
        // Hide with a delay so that ContextMenuItem has time to
        // react to click event before element unmounts.
        setTimeout(() => {
            if (this.unmounted) { return }
            this.setState({
                isMenuOpen: false,
            })
        }, 100)
    }

    toggleExport = (port) => {
        this.props.setPortOptions(port.id, {
            export: !port.export,
        })
    }

    disconnectAll = (port) => {
        const action = { type: 'Disconnect all port connections' }
        this.props.api.setCanvas(action, (canvas) => (
            disconnectAllFromPort(canvas, port.id)
        ))
    }

    render() {
        const { port, canvas, api } = this.props
        const isInput = !!port.acceptedTypes
        const dragPortInProgress = (
            this.context.isDragging // something is dragging
            && this.context.data.portId != null // something has a port
        )

        const sourcePort = dragPortInProgress && (this.context.data.sourceId || this.context.data.portId)
        const draggingFromSameModule = dragPortInProgress && hasPort(canvas, sourcePort) && arePortsOfSameModule(canvas, sourcePort, port.id)

        const from = this.context.data || {}
        const fromId = from.sourceId || from.portId
        const canDrop = dragPortInProgress && canConnectPorts(this.props.canvas, fromId, this.props.port.id)
        const isExported = !!port.export

        return (
            <div
                ref={this.iconRef}
                role="gridcell"
                title={port.id}
                className={cx(styles.PortIcon, {
                    [styles.isInput]: isInput,
                    [styles.isExported]: isExported,
                    [styles.isOutput]: !isInput,
                    [styles.connected]: port.connected,
                    [styles.requiresConnection]: port.requiresConnection,
                    [styles.drivingInput]: port.drivingInput,
                    [styles.noRepeat]: port.noRepeat,
                    [styles.dragPortInProgress]: dragPortInProgress,
                    [styles.canDrop]: canDrop,
                    [styles.draggingFromSameModule]: draggingFromSameModule,
                })}
                tabIndex="0"
                onContextMenu={this.openContextMenu}
            >
                <div className={styles.portIconInner}>
                    <div className={styles.portIconGraphic} ref={this.onRef} />
                    <DropTarget port={port} />
                    <DragSource port={port} api={api} />
                </div>
                <PortOptions port={port} canvas={canvas} setPortOptions={this.props.setPortOptions} />
                <ContextMenu
                    placement={isInput ? 'left-start' : 'right-start'}
                    target={this.iconRef}
                    isOpen={this.state.isMenuOpen}
                >
                    <ContextMenu.Item text="Disconnect all" onClick={() => this.disconnectAll(port)} />
                    <ContextMenu.Item text={isExported ? 'Disable export' : 'Enable export'} onClick={() => this.toggleExport(port)} />
                </ContextMenu>
            </div>
        )
    }
}

class Port extends React.PureComponent {
    onChangePortName = (value) => {
        const { port } = this.props
        this.props.setPortOptions(port.id, {
            displayName: value,
        })
    }

    render() {
        const { port, canvas } = this.props
        const isInput = !!port.acceptedTypes
        const isParam = 'defaultValue' in port
        const hasInputField = isParam || port.canHaveInitialValue
        const isRunning = canvas.state === 'RUNNING'

        let isHidden = false
        if (!isInput) {
            const linkedInput = findLinkedVariadicPort(canvas, port.id)
            if (linkedInput) {
                // hide output if linked input is not connected
                isHidden = !isPortConnected(canvas, linkedInput.id)
            }
        }

        if (isHidden) {
            // layout placeholder
            return <React.Fragment><div /><div /><div /></React.Fragment>
        }

        const portContent = [
            <div
                className={cx(styles.portNameContainer, {
                    [styles.isInput]: isInput,
                    [styles.isOutput]: !isInput,
                })}
                key={`${port.id}.name`}
                role="gridcell"
            >
                <UseState initialValue={false}>
                    {(editing, setEditing) => (
                        <EditableText
                            className={styles.portName}
                            disabled={!!isRunning}
                            editing={editing}
                            onChange={this.onChangePortName}
                            setEditing={setEditing}
                        >
                            {port.displayName || startCase(port.name)}
                        </EditableText>
                    )}
                </UseState>
            </div>,
            <PortIcon key={`${port.id}.icon`} {...this.props} />,
        ]

        if (isInput) {
            /* flip icon/name order */
            portContent.reverse()
        }

        return (
            <React.Fragment>
                {portContent}
                {hasInputField ? (
                    /* add input for params/inputs with initial value */
                    <div className={cx(styles.portValueContainer)} role="gridcell">
                        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                        <PortValue
                            className={styles.portValue}
                            port={port}
                            canvas={canvas}
                            onChange={this.props.onChange}
                        />
                    </div>
                ) : (
                    !!isInput && (
                        /* placeholder div for consistent icon vertical alignment */
                        <div className={cx(styles.portValueContainer)} role="gridcell">
                            <div className={styles.portValue} />
                        </div>
                    )
                )}
            </React.Fragment>
        )
    }
}

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
                        title={`Driving Input: ${port.drivingInput ? 'On' : 'Off'}`}
                        value={!!port.drivingInput}
                        className={styles.drivingInputOption}
                        onClick={this.getToggleOption('drivingInput')}
                        disabled={!!isRunning}
                    >
                        DI
                    </button>
                )}
                {port.canBeNoRepeat && (
                    <button
                        type="button"
                        title={`No Repeat: ${port.drivingInput ? 'On' : 'Off'}`}
                        value={!!port.noRepeat}
                        className={styles.noRepeatOption}
                        onClick={this.getToggleOption('noRepeat')}
                        disabled={!!isRunning}
                    >
                        NR
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
                            placeholder="key"
                            value={key}
                            onChange={this.getOnChange('key', index)}
                            onFocus={this.getOnFocus('key', index)}
                            onBlur={this.props.onBlur}
                            ref={this.getKeyRef(index)}
                        />
                        {/* Value Input */}
                        <input
                            className={cx(styles.mapParamValue, styles.portValue)}
                            placeholder="value"
                            value={value}
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
        this.setState({ value }, done)

        // If select, fire onChange immediately
        if (this.props.port.possibleValues) {
            this.triggerChange(value)
        }
    }

    triggerChange = (value) => {
        this.props.onChange(this.props.port.id, value)
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

        // For select, value has been sent already
        if (!this.props.port.possibleValues) {
            this.triggerChange(value)
        }

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

        if (port.type === 'Map') {
            return (
                <MapParam
                    {...{
                        port,
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

        if (port.type === 'Color') {
            return (
                <ColorPicker
                    {...props}
                    value={value}
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

        /* Stream */
        if (port.type === 'Stream') {
            return (
                <StreamSelector
                    {...props}
                    value={value}
                    disabled={disabled}
                    style={style}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
            )
        }

        return (
            <UseState initialValue={false}>
                {(editing, setEditing) => (
                    <EditableText
                        {...props}
                        className={null}
                        disabled={disabled}
                        editing={editing}
                        editOnFocus
                        /* EditableText calls its onChange on blur. This allows
                           us to trigger changes directly using `triggerChange`. */
                        onChange={this.triggerChange}
                        placeholder={port.displayName || port.name}
                        setEditing={setEditing}
                    >
                        {value}
                    </EditableText>
                )}
            </UseState>
        )
    }
}

// this is the `display: table` equivalent of `<td colspan="3" />`. For alignment.
const PortPlaceholder = () => <React.Fragment><div /><div /><div style={{ minWidth: '100%' }} /></React.Fragment>

export default class Ports extends React.Component {
    render() {
        const {
            api,
            module,
            canvas,
            onPort,
            onValueChange,
            className,
        } = this.props

        const { outputs } = module

        const inputs = module.params.concat(module.inputs)

        // map inputs and outputs into visual rows
        const rows = []
        const maxRows = Math.max(inputs.length, outputs.length)
        for (let i = 0; i < maxRows; i += 1) {
            rows.push([inputs[i], outputs[i]])
        }

        return (
            <div className={cx(className, styles.ports)}>
                {rows.map((ports) => (
                    <div key={ports.map((p) => p && p.id).join(',')} className={styles.portRow} role="row">
                        {ports.map((port, index) => (
                            /* eslint-disable react/no-array-index-key */
                            !port ? <PortPlaceholder key={index} /> /* placeholder for alignment */ : (
                                <Port
                                    key={port.id + index}
                                    port={port}
                                    onPort={onPort}
                                    canvas={canvas}
                                    api={api}
                                    onChange={onValueChange}
                                    setPortOptions={api.port.setPortOptions}
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
