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
        return {
            value: port.value || port.defaultValue,
        }
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

    render() {
        const { port, ...props } = this.props
        const isInput = !!port.acceptedTypes
        const isParam = 'defaultValue' in port

        const portContent = [
            <div
                role="gridcell"
                key={`${port.id}.name`}
                className={cx(styles.portName, {
                    input: isInput,
                    output: !isInput,
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
                            [styles.dragInProgress]: props.itemType,
                            [styles.dragPortInProgress]: props.itemType === DragTypes.Port,
                            [styles.dragModuleInProgress]: props.itemType === DragTypes.Module,
                            [styles.isDragging]: props.isDragging,
                            [styles.connected]: port.connected,
                            [styles.canDrop]: props.canDrop,
                            [styles.isOver]: props.isOver,
                        })}
                    />
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
                <div key={`${port.id}.value`} className={styles.portValueContainer} role="gridcell">
                    <input
                        className={styles.portValue}
                        value={this.state.value}
                        disabled={!!port.connected}
                        onChange={this.onChange}
                        size={this.props.size}
                        style={{
                            // setting minWidth allows size transition
                            minWidth: `${this.props.size}ch`,
                        }}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        onMouseOver={() => this.props.setIsDraggable(false)}
                        onMouseOut={() => this.props.setIsDraggable(true)}
                    />
                </div>
            ))
        } else if (isInput) {
            /* placeholder div for consistent icon vertical alignment */
            portContent.push((
                <div key={`${port.id}.value`} className={styles.portValueContainer} role="gridcell">
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
